
var fs = require('fs-extra');
var Q = require('q');
var exec = require('child_process').exec;

module.exports = {
	cprf: 'content-project',
	templateTest : {
  		imports: ["org.openqa.selenium.By","org.openqa.selenium.WebElement"," org.openqa.selenium.support.ui.ExpectedConditions",
  		"org.openqa.selenium.support.ui.WebDriverWait","org.testng.Assert","org.testng.annotations.*","org.openqa.selenium.WebDriver",
  		"org.openqa.selenium.firefox.FirefoxDriver", "com.opera.core.systems.OperaDriver", "org.openqa.selenium.chrome.ChromeDriver"],
  		name:"",
  		functionTest: {    		
    		instrunctions:[],  
  		}  
	},
	targetId : "",
	tree: [],
	createPackage: function(projectId,parentId,packageName){
		var defer = Q.defer(); 
		Project.findOne({id:projectId}).exec(function(err,project){
			if(err){
				defer.reject({message: "No se logro crear el paquete"});
			}else{
				//console.info("creando paquete en el projecto "+project.name);
				var pathPacket = projectService.cprf+"/"+projectId+"/src";
				projectService.getPath(parentId).then(function(objPath){
					//console.info(objPath.path);
					pathPacket += objPath.path;
					Packet.findOne({parentId:parentId,name:packageName,projectId:projectId}).exec(function(err,packet){
						if(err){
							defer.reject({message: "No se logro crear el paquete"});
						}else{
							if(packet){
								defer.reject({message:"Error ya existe un paquete con ese nombre"});
							}else{
								projectService.createFolder(pathPacket,packageName).then(function(packet){
									var objTest = {
										type: "p",
										name: packageName,
										descripcion: "",						
										parentId:parentId,
										projectId:projectId,
										project:projectId						
									}
									Packet.create(objTest).exec(function(err,cTest){
										if(err){
											defer.reject(err);
										}else{
											defer.resolve({stats:0});		
										}
									});							
								}).fail(function(err){
									defer.reject({message: "No se logro crear el paquete"});
								});								
							}
						}
					});

				}).fail(function(err){
					defer.reject(err);
				});

			}
		});		
		return defer.promise;
	},

	createProjectRoot: function(projectID,projectName){
		var defer = Q.defer();
		//var nameRoot = projectID + "_" + projectName;
		var nameRoot = projectID;
		var path = projectService.cprf+"/"+nameRoot;	

		projectService.createFolder(path,"").then(function(data){
			var arrayFolders = [
				projectService.createFolder(path,"src"),
				projectService.createFolder(path,"libs"),
				projectService.createFolder(path,"bin")
			];
			Q.all(arrayFolders).then(function(data){				
				projectService.listFiles("libs").then(function(files){					
					var pathlibs = path+"/libs/";
					//console.info(pathlibs);
					var symLinkArray = [];
					for (var i = 0; i < files.length; i++) {
						//symLinkArray.push(projectService.creatSymbolicLink("libs/"+files[i],pathlibs+files[i]))	
						symLinkArray.push(projectService.copyFile("libs/"+files[i],pathlibs+files[i]))	
					};	
					Q.all(symLinkArray).then(function(filesArray){

						projectService.copyFile("testng-results.xsl",path + "/src/testng-results.xsl").then(function(data){
							projectService.copyFile("build.xml",path + "/build.xml").then(function(data){
								defer.resolve({status:0});
							}).fail(function(err){
								console.info(err);
								defer.reject({message:"Error al inicializar el proyecto"});	
							});	
						}).fail(function(err){
							console.info(err);
							defer.reject({message:"Error al inicializar el proyecto"});	
						});	

					}).fail(function(err){
						//console.info("createProjectRoot: No se logro crear enlaces simbolicos");
						defer.reject({message:"Error al inicializar el proyecto"});	
					});			
			    }).fail(function(err){
			    	//console.info("createProjectRoot: No se logro obtener el listado de archivos");
			      	defer.reject({message:"Error al inicializar el proyecto"});
			    });
			}).fail(function(err){
				//console.info("createProjectRoot: No se logro crear el folder libs");
				defer.reject({message:"Error al inicializar el proyecto"});
			});
		}).fail(function(err){
			//console.info("createProjectRoot: No se logro crear los folders");
			defer.reject({message:"Error al inicializar el proyecto"});
		});
		
		return defer.promise;
	},

	createFolder: function(path,folderName){
		var defer = Q.defer();
		fs.ensureDir(path+"/"+folderName,function(err,data){
			if(err){
				defer.reject({message:"No se logro crear el folder"});
			}else{
				defer.resolve({status:0});
			}
		});
		return defer.promise;	
	},

	listFiles: function(path){
		var defer = Q.defer();
		fs.readdir(path,function(err,stats){
			if(err){
				defer.reject(err);
			}else{				
				defer.resolve(stats);
			}

		});
		return defer.promise;	
	},

	creatSymbolicLink: function(srcPath,dstPath){
		var defer = Q.defer();
		fs.symlink(srcPath,dstPath,'file',function(err,sl){
			if(err){
				defer.reject(err);
			}else{				
				defer.resolve(sl);
			}
		});
		return defer.promise;		
	},

	copyFile: function(srcPath,dstPath){
		var defer = Q.defer();
		fs.copy(srcPath,dstPath,function(err,file){
			if(err){
				defer.reject(err);
			}else{				
				defer.resolve(file);
			}
		});
		return defer.promise;			
	},

	createTest: function(projectId,parentId,nameTest,paramsTest,browser,save){
		var defer = Q.defer();
		var projectId = projectId;
		var pathProject = projectService.cprf+"/"+projectId+"/src";
		
		var tmpl = projectService.templateTest;
		var time = 15;
		tmpl.name= nameTest;
		var test ="";
		if(parentId != "0"){
			Packet.findOne({id:parentId}).exec(function(err,objPackage){
				if(err){
					console.log(err);
					defer.reject({message:"NO se pudo crear el test"});
				}else{
					if(objPackage){
						console.log(objPackage.name);
						test += "package " + objPackage.name + ";\n";
						for (var i = 0; i < tmpl.imports.length; i++) {
							test += "import "+tmpl.imports[i]+";\n";
						};

						if(browser == "firefox"){
							test += "\npublic class "+ tmpl.name + "_firefox" +"{\n\n";
						}else
						if(browser == "chrome"){
							test += "\npublic class "+ tmpl.name + "_chrome" +"{\n\n";
						}else
						if(browser == "opera"){
							test += "\npublic class "+ tmpl.name + "_opera" +"{\n\n";
						}
						
						test += "	WebDriver driver;\n";
						test += "	WebDriverWait wait;\n\n";

						if(browser == "firefox"){
							test += "	@BeforeClass\n";
							test += "	public void InitDriver(){\n";
							test += "		driver = new FirefoxDriver();\n";
							test += "		wait = new WebDriverWait(driver,15,1);\n";
							test += "		driver.get(\""+paramsTest.url+"\");\n";
							test += "	}\n\n";
						}else if(browser == "chrome"){
							test += "	@BeforeClass\n";
							test += "	public void InitDriver(){\n";
							test += "		System.setProperty(\"webdriver.chrome.driver\", \"/home/jose/Escritorio/Proyecto Sp2/tested/content-project/chromedriver\");\n";
       						test += "    	driver = new ChromeDriver();\n"
							test += "		wait = new WebDriverWait(driver,15,1);\n";
							test += "		driver.get(\""+paramsTest.url+"\");\n";
							test += "	}\n\n";
						}else if(browser == "opera"){
							test += "	@BeforeClass\n";
							test += "	public void InitDriver(){\n";
							test += "		driver = new OperaDriver();\n";
							test += "		wait = new WebDriverWait(driver,15,1);\n";
							test += "		driver.get(\""+paramsTest.url+"\");\n";
							test += "	}\n\n";
						}

						test += "	@Test\n";
						test += "	public void "+ tmpl.name +"_test(){\n";
				        var cont = 0;
						for(var i =0; i <paramsTest.selectorFind.length; i++){
							//console.log(paramsTest.selectorFind[i]);
							if(paramsTest.selectorFind[i] == "class"){
								test += "		wait.until(ExpectedConditions.visibilityOfElementLocated(By.className(\""+paramsTest.elementName[i] +"\")));\n";
								test += "		driver.findElement(By.className(\""+paramsTest.elementName[i]+"\"))";
								test = projectService.actionElement(test,paramsTest.selectorAction[i],paramsTest.elementText[cont]);

							}else 
							if(paramsTest.selectorFind[i] == "id"){
								test += "		wait.until(ExpectedConditions.visibilityOfElementLocated(By.id(\""+paramsTest.elementName[i] +"\")));\n";
								test += "		driver.findElement(By.id(\""+paramsTest.elementName[i]+"\"))";
								test =projectService.actionElement(test,paramsTest.selectorAction[i],paramsTest.elementText[cont]);
							}else
							if(paramsTest.selectorFind[i] == "text"){
								test += "		wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath(\"//*[text()='"+paramsTest.elementName[i]+"']\")));\n";
								test += "		driver.findElement(By.xpath(\"//*[text()='"+paramsTest.elementName[i]+"']\"))";
								test =projectService.actionElement(test,paramsTest.selectorAction[i],paramsTest.elementText[cont]);
							}
							if(paramsTest.selectorAction[i] == "write"){
								cont++;
							}
						}

						test += "		try{\n"; 
						for(var i =0; i <paramsTest.selectorFindDesition.length; i++){
							if(paramsTest.selectorFindDesition[i] == "class"){
								test += "			wait.until(ExpectedConditions.visibilityOfElementLocated(By.className(\""+paramsTest.elementNameDesition[i] +"\")));\n";	
							}else
							if(paramsTest.selectorFindDesition[i] == "id"){
								test += "			wait.until(ExpectedConditions.visibilityOfElementLocated(By.id(\""+paramsTest.elementNameDesition[i] +"\")));\n";
							}else
							if(paramsTest.selectorFindDesition[i] == "text"){
								test += "			wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath(\"//*[text()='"+paramsTest.elementNameDesition[i]+"']\")));\n";
							}
						}
						test += "		}catch(Exception e){\n";
						test += "			Assert.fail(\" MENSAJE DE ERROR \" + e.getMessage());\n";
						test += "		}\n";
						test += "	}\n\n"

						test += "	@AfterClass\n";
						test += "	public void closeDriver(){\n";
						test += "		driver.close();\n";
						test += "	}\n";
						test += "}";
					}
				}
			});
		}else{
			for (var i = 0; i < tmpl.imports.length; i++) {
				test += "import "+tmpl.imports[i]+";\n";
			};

				if(browser == "firefox"){
					test += "\npublic class "+ tmpl.name + "_firefox" +"{\n\n";
				}else
				if(browser == "chrome"){
					test += "\npublic class "+ tmpl.name + "_chrome" +"{\n\n";
				}else
				if(browser == "opera"){
					test += "\npublic class "+ tmpl.name + "_opera" +"{\n\n";
				}
			test += "	WebDriver driver;\n";
			test += "	WebDriverWait wait;\n\n";
			if(browser == "firefox"){
				test += "	@BeforeClass\n";
				test += "	public void InitDriver(){\n";
				test += "		driver = new FirefoxDriver();\n";
				test += "		wait = new WebDriverWait(driver,15,1);\n";
				test += "		driver.get(\""+paramsTest.url+"\");\n";
				test += "	}\n\n";
			}else if(browser == "chrome"){
				test += "	@BeforeClass\n";
				test += "	public void InitDriver(){\n";
				test += "		System.setProperty(\"webdriver.chrome.driver\", \"/home/jose/Escritorio/Proyecto Sp2/tested/content-project/chromedriver\");\n";
					test += "    	driver = new ChromeDriver();\n"
				test += "		wait = new WebDriverWait(driver,15,1);\n";
				test += "		driver.get(\""+paramsTest.url+"\");\n";
				test += "	}\n\n";
			}else if(browser == "opera"){
				test += "	@BeforeClass\n";
				test += "	public void InitDriver(){\n";
				test += "		driver = new OperaDriver();\n";
				test += "		wait = new WebDriverWait(driver,15,1);\n";
				test += "		driver.get(\""+paramsTest.url+"\");\n";
				test += "	}\n\n";
			}
			test += "	@Test\n";
			test += "	public void "+ tmpl.name +"_test(){\n";
	        var cont = 0;
			for(var i =0; i <paramsTest.selectorFind.length; i++){
				//console.log(paramsTest.selectorFind[i]);
				if(paramsTest.selectorFind[i] == "class"){
					test += "		wait.until(ExpectedConditions.visibilityOfElementLocated(By.className(\""+paramsTest.elementName[i] +"\")));\n";
					test += "		driver.findElement(By.className(\""+paramsTest.elementName[i]+"\"))";
					test = projectService.actionElement(test,paramsTest.selectorAction[i],paramsTest.elementText[cont]);

				}else 
				if(paramsTest.selectorFind[i] == "id"){
					test += "		wait.until(ExpectedConditions.visibilityOfElementLocated(By.id(\""+paramsTest.elementName[i] +"\")));\n";
					test += "		driver.findElement(By.id(\""+paramsTest.elementName[i]+"\"))";
					test =projectService.actionElement(test,paramsTest.selectorAction[i],paramsTest.elementText[cont]);
				}else
				if(paramsTest.selectorFind[i] == "text"){
					test += "		wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath(\"//*[text()='"+paramsTest.elementName[i]+"']\")));\n";
					test += "		driver.findElement(By.xpath(\"//*[text()='"+paramsTest.elementName[i]+"']\"))";
					test =projectService.actionElement(test,paramsTest.selectorAction[i],paramsTest.elementText[cont]);
				}
				if(paramsTest.selectorAction[i] == "write"){
					cont++;
				}
			}

			test += "		try{\n"; 
			for(var i =0; i <paramsTest.selectorFindDesition.length; i++){
				if(paramsTest.selectorFindDesition[i] == "class"){
					test += "			wait.until(ExpectedConditions.visibilityOfElementLocated(By.className(\""+paramsTest.elementNameDesition[i] +"\")));\n";	
				}else
				if(paramsTest.selectorFindDesition[i] == "id"){
					test += "			wait.until(ExpectedConditions.visibilityOfElementLocated(By.id(\""+paramsTest.elementNameDesition[i] +"\")));\n";
				}else
				if(paramsTest.selectorFindDesition[i] == "text"){
					test += "			wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath(\"//*[text()='"+paramsTest.elementNameDesition[i]+"']\")));\n";
				}
			}
			test += "		}catch(Exception e){\n";
			test += "			Assert.fail(\" MENSAJE DE ERROR \" + e.getMessage());\n";
			test += "		}\n";
			test += "	}\n\n"

			test += "	@AfterClass\n";
			test += "	public void closeDriver(){\n";
			test += "		driver.close();\n";
			test += "	}\n";
			test += "}";
		}
		var namefile = "";
		if(save){
			Test.findOne({parentId:parentId,name:nameTest,projectId:projectId}).exec(function(err,objTest){
				if(err){
					defer.reject(err);
				}else{
					if(objTest){
						defer.reject({message:"Error ya existe un test con ese nombre"});
					}else{
						projectService.getPath(parentId).then(function(objPath){
							//console.info(objPath.path);
							pathProject += objPath.path;
							if(browser == "firefox"){
								namefile = pathProject+tmpl.name+"_firefox"+".java"
								console.log(namefile);
							}else
							if(browser == "chrome"){
								namefile = pathProject+tmpl.name+"_chrome"+".java"
								console.log(namefile);
							}else
							if(browser == "opera"){
								namefile = pathProject+tmpl.name+"_opera"+".java"
								console.log(namefile);
							}							
							projectService.createFile(namefile).then(function(file){
								projectService.writeFile(namefile,test).then(function(data){
									var objTest = {
										type: "t",
										name: nameTest,
										descripcion: "",
										resultado:"",
										parentId:parentId,
										projectId:projectId,
										project:projectId
									}
									Test.create(objTest).exec(function(err,cTest){
										if(err){
											defer.reject(err);
										}else{
											defer.resolve({stats:0});	
										}
									});
									
								}).fail(function(err){
									defer.reject(err);
								});
							}).fail(function(err){
								defer.reject(err);
							});
						}).fail(function(err){
							defer.reject(err);
						})
					}
					
				}
			});
		}else{
			projectService.getPath(parentId).then(function(objPath){
				//console.info(objPath.path);
				pathProject += objPath.path;
				if(browser == "firefox"){
					namefile = pathProject+tmpl.name+"_firefox"+".java"
					console.log(namefile);
				}else
				if(browser == "chrome"){
					namefile = pathProject+tmpl.name+"_chrome"+".java"
					console.log(namefile);
				}else
				if(browser == "opera"){
					namefile = pathProject+tmpl.name+"_opera"+".java"
					console.log(namefile);
				}							
				projectService.createFile(namefile).then(function(file){
					projectService.writeFile(namefile,test).then(function(data){
						defer.resolve({stats:0});
						
					}).fail(function(err){
						defer.reject(err);
					});
				}).fail(function(err){
					defer.reject(err);
				});
			}).fail(function(err){
				defer.reject(err);
			})
		}
		return defer.promise;	
	},

	createXMLFile: function(testIds,packageId,projectId){
		console.log("asddd");
		console.log(packageId);
		var defer = Q.defer();
		var pathProject = projectService.cprf+"/"+projectId+"/src";
		var pathRun = projectService.cprf+"/"+projectId;
		var testXML = "";
		testXML += "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n";
		testXML += "<!DOCTYPE suite SYSTEM \"http://testng.org/testng-1.0.dtd\">\n";
		testXML += "<suite name=\"Tested\" parallel=\"false\">\n";
		testXML += "<test name=\"default\">\n<classes>\n";
		Test.find({where:{id:testIds}}).exec(function(err,tests){
			if(err){
				console.log(err);
				defer.reject({message:"NO se pudo crear el archivo xml"});
			}else{
				if(tests){
					if(packageId == "0"){
						for (var i = 0; i < testIds.length; i++) {
							testXML += "<class name=\"" + tests[i].name + "\"/>\n";
						}
						testXML += "</classes>\n";
						testXML += "</test>\n";
						testXML += "</suite>\n";
						projectService.writeFile(pathProject + "/testng.xml",testXML).then(function(file){
							defer.resolve(pathRun);
						}).fail(function(err){
							console.log(err);
							defer.reject({message:"NO se pudo crear el archivo xml"});
						});
					}else{
						Packet.findOne({id:packageId,projectId:projectId}).exec(function(err,objPackage){
							if(err){
								console.log(err);
								defer.reject({message:"NO se pudo crear el archivo xml"});
							}else{
								if(objPackage){
									console.log(objPackage.name);
									for (var i = 0; i < testIds.length; i++) {

										testXML += "<class name=\"" + objPackage.name + "." + tests[i].name + "\"/>\n";
									}
									testXML += "</classes>\n";
									testXML += "</test>\n";
									testXML += "</suite>\n";
									projectService.writeFile(pathProject + "/testng.xml",testXML).then(function(file){
										defer.resolve(pathRun);
									}).fail(function(err){
										console.log(err);
										defer.reject({message:"NO se pudo crear el archivo xml"});
									});
								}
							}
						});
					}
					
				}
			}
		});
		return defer.promise;
	},

	runTest: function(testIds,packageId,projectId){
		var defer = Q.defer();
 		projectService.createXMLFile(testIds,packageId, projectId).then(function(pathRun){
 			var child = exec('cd ' + pathRun + ' && ant',function (err, stdout, stderr) {
    		if (err) {
    			console.log(err);
     			defer.reject({message:"No se logro correr el test "});
    		}
    		defer.resolve({status:0});
		});
 		}).fail(function(err){
 			console.log(err);
			defer.reject({message:"No se pudo crear el archivo xml"});
 		});
 		return defer.promise;
	},

	actionElement: function(test,action,textwrite){
		console.log(action);
		if(action == "click"){
			test += ".click();\n";
		}else
		if(action == "write"){	
			test += ".sendKeys(\""+textwrite+"\");\n";
		}
		return test;
	},

	createFile: function(srcPath){
		var defer = Q.defer();
		fs.open(srcPath,"w+",function(err,file){
			if(err){
				defer.reject(err);
			}else{				
				defer.resolve(file);
			}

		});
		return defer.promise;				
	},

	writeFile: function(name,text){
		var defer = Q.defer();
		fs.writeFile(name,text,function(err,file){
			if(err){
				defer.reject(err);
			}else{				
				defer.resolve(file);
			}

		});
		return defer.promise;				
	},

	deleteItems : function(items){
		var defer = Q.defer();
		var deleteItemQArray = [];
		for (var i = 0; i < items.length; i++) {
			deleteItemQArray.push(projectService.deleteItem(items[i]));
		};
		Q.all(deleteItemQArray).then(function(deletedItems){
			defer.resolve({status:0});
		}).fail(function(err){
			defer.reject({message: "Error: item no encontrado"});
		});
		return defer.promise;
	},
	deleteItem : function(itemId){
		var defer = Q.defer();
		console.info("entro "+itemId);
		Test.findOne({id:itemId}).exec(function(err,item){
			if(err){
				defer.reject(err);
			}else{
				console.info("entro "+itemId);
				if(item){			
					console.info(item);	
					projectService.getPath(item.parentId).then(function(objPath){
						var path = projectService.cprf+"/"+item.projectId+"/src"+objPath.path + item.name+ "_firefox"+".java";
						console.info("eliminando "+path);
						fs.unlink(path,function(err,deletedItem){
							if(err){
								console.info(err)
								defer.reject({message: "Error: item no encontrado"});
							}else{
								Test.destroy({id:item.id}).exec(function(err,delItem){
									if(err){
										defer.reject({message: "Error: item no encontrado"});
									}else{
										var path = projectService.cprf+"/"+item.projectId+"/src"+objPath.path + item.name+ "_chrome" + ".java";
										fs.unlink(path,function(err,deletedItem){
											if(err){
												console.info(err)
												defer.reject({message: "Error: item no encontrado"});
											}else{
												Test.destroy({id:item.id}).exec(function(err,delItem){
													if(err){
														defer.reject({message: "Error: item no encontrado"});
													}else{
														var path = projectService.cprf+"/"+item.projectId+"/src"+objPath.path + item.name+ "_opera" + ".java";
														fs.unlink(path,function(err,deletedItem){
															if(err){
																console.info(err)
																defer.reject({message: "Error: item no encontrado"});
															}else{
																Test.destroy({id:item.id}).exec(function(err,delItem){
																	if(err){
																		defer.reject({message: "Error: item no encontrado"});
																	}else{
																		defer.resolve({status:0});
																	}
																});
															}
														});
													}
												});
											}
										});				
									}
								});
							}
						});				
					}).fail(function(err){
						console.info(err.stack);
						defer.reject({message: "Error: item no encontrado"});	
					});

				}else{
					defer.reject({message: "Error: item no encontrado"});
				}
			}
		});
		return defer.promise;					
	},
	getTree:function(parentId,projectId){
		var defer = Q.defer();				
		if(parentId=="0" || parentId == 0 || parentId == undefined){
			projectService.tree = [{
						title    : "root",
	            		isFolder : true,
	            		isLazy   : true,
	            		key      : "0",
	            		expand   : true,
	            		focus    : projectService.targetId == parentId,
	            		active   : projectService.targetId == parentId,
	            		activate : projectService.targetId == parentId,
	            		select : projectService.targetId == parentId,
	            		children : []
            		}];
			defer.resolve(projectService.tree[0]);
		}else{
			//console.info("buscando itemId: "+itemId);
			Packet.findOne({id:parentId}).exec(function(err,packet){
				if(err){
					defer.reject(err);
				}else{
					//console.info(packet);
					projectService.getTree(packet.parentId,projectId).then(function(objTree){						
						projectService.dynamicTree(objTree.key,projectId).then(function(children){
						    objTree.children = children;
						    var index = findInArrayService.findInArray(objTree.children,"key",parentId)
					    	if(projectService.targetId == parentId){					    		
					    		projectService.dynamicTree(parentId,projectId).then(function(children){
					    			objTree.children[index].focus = projectService.targetId == parentId;
					    			objTree.children[index].active = projectService.targetId == parentId;
					    			objTree.children[index].activate = projectService.targetId == parentId;
					    			objTree.children[index].select = projectService.targetId == parentId;
					    			objTree.children[index].children = children;
					    			defer.resolve(projectService.tree);					    			
					    		}).fail(function(err){
							    	defer.reject(err);
							    });	
					    	}else{		
					    		
					    		defer.resolve(objTree.children[index]);
					    	} 					    	
					    }).fail(function(err){
					    	defer.reject(err);
					    });						
					}).fail(function(err){
						console.info(err);
						defer.reject(err);
					});
				}
			});
		}
		return defer.promise;
	},
	dynamicTree: function(parentId,projectId){
		var defer = Q.defer();
		Packet.find({parentId:parentId,projectId:projectId,type:'p'}).exec(function(err,packets){
			if(err){
				defer.reject(err);
			}else{
				var children = [];	
				//console.info(packets);
				if(packets.length>0){
					var iterativeFor = function(i){
						Packet.find({parentId:packets[i].id,projectId:projectId,type:'p'}).exec(function(err,pChildren){
							if(err){
								defer.reject(err);			
							}else{								
								children.push({
									title: packets[i].name,
									isFolder : packets[i].type == 'p',
									isLazy: pChildren.length>0,
									key: packets[i].id,
									focus: false,
									select:false,
									active:false,
									activate:false
									
								});
								if(++i>=packets.length){
									defer.resolve(children);
								}else{
									iterativeFor(i);											
								}
							}
						});
					}
					iterativeFor(0);
				}else{
					defer.resolve(children);
				}				
			}
		});
		return defer.promise;
	},

	getChildren:function(children){
		var defer = Q.defer();		
	},
	contentProject: function(parentId,projectId){
		var defer = Q.defer();
		Test.find({parentId:parentId,projectId:projectId}).exec(function(err,tests){
			if(err){
				defer.reject(err);
			}else{				
				defer.resolve(tests);
			}
		});
		return defer.promise;
	},

	getPath: function(itemId){
		
		var defer = Q.defer();
		var path = "";
		
		console.info("itemId: "+ itemId);
		if(itemId=="0" || itemId == 0 || itemId == undefined){
			defer.resolve({path:"/",pathArray:[]});
		}else{
			//console.info("buscando itemId: "+itemId);
			Packet.findOne({id:itemId}).exec(function(err,packet){
				if(err){
					defer.reject(err);
				}else{
					//console.info(packet);
					projectService.getPath(packet.parentId).then(function(objPath){
						objPath.path += packet.name+"/";
						objPath.pathArray.push({id:packet.id,name:packet.name});
						//console.info(objPath);
						defer.resolve(objPath);
					}).fail(function(err){
						defer.reject(err);
					})
				}
			});
		}
		return defer.promise;
	},
};