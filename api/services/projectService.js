
var fs = require('fs-extra');
var Q = require('q');
var exec = require('child_process').exec;

module.exports = {
	cprf: 'content-project',
	templateTest : {
  		imports: ["org.testng.*","org.openqa.selenium.*"],
  		name:"",
  		functionTest: {    		
    		instrunctions:[],  
  		}  
	},
	createPackage: function(projectId,parentId,packageName){
		var defer = Q.defer();
		Project.findOne({id:projectId}).exec(function(err,project){
			if(err){
				defer.reject({message: "No se logro crear el paquete"});
			}else{
				console.info("creando paquete en el projecto "+project.name);
				var pathPacket = projectService.cprf+"/"+projectId+"/src";
				projectService.getPath(parentId).then(function(objPath){
					console.info(objPath.path);
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
					console.info(pathlibs);
					var symLinkArray = [];
					for (var i = 0; i < files.length; i++) {
						//symLinkArray.push(projectService.creatSymbolicLink("libs/"+files[i],pathlibs+files[i]))	
						symLinkArray.push(projectService.copyFile("libs/"+files[i],pathlibs+files[i]))	
					};	
					Q.all(symLinkArray).then(function(filesArray){
						defer.resolve({status:0});
					}).fail(function(err){
						console.info("createProjectRoot: No se logro crear enlaces simbolicos");
						defer.reject({message:"Error al inicializar el proyecto"});	
					});			
			    }).fail(function(err){
			    	console.info("createProjectRoot: No se logro obtener el listado de archivos");
			      	defer.reject({message:"Error al inicializar el proyecto"});
			    });
			}).fail(function(err){
				console.info("createProjectRoot: No se logro crear el folder libs");
				defer.reject({message:"Error al inicializar el proyecto"});
			});
		}).fail(function(err){
			console.info("createProjectRoot: No se logro crear los folders");
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

	createTest: function(projectId,parentId,nameTest,paramsTest){
		var defer = Q.defer();
		var projectId = projectId;
		var pathProject = projectService.cprf+"/"+projectId+"/src";
		
		var tmpl = projectService.templateTest;
		var time = 15;
		tmpl.name= nameTest;
		var test ="";
		for (var i = 0; i < tmpl.imports.length; i++) {
			test += "import "+tmpl.imports[i]+";\n";
		};

		test += "\npublic class "+ tmpl.name +"{\n\n";
		test += "	WebDriver driver;\n";
		test += "	WebDriverWait wait;\n\n";
		test += "	@Test\n";
		test += "	public void "+ tmpl.name +"_test(){\n";
		test += "		driver = new FirefoxDriver();\n";
		test += "		wait = new WebDriverWait(driver,15);\n";
		test += "		driver.get(\""+paramsTest.url+"\");\n";

		for(var i =0; i <paramsTest.selectorFind.length; i++){
			console.log(paramsTest.selectorFind[i]);
			if(paramsTest.selectorFind[i] == "class"){
				test += "		wait.until(ExpectedConditions.visibilityOfElementLocated(By.className(\""+paramsTest.elementName[i] +"\")));\n";
				test += "		driver.findElement(By.className(\""+paramsTest.elementName[i]+"\"))";
				test = projectService.actionElement(test,paramsTest.selectorAction[i],paramsTest.elementText[i]);

			}else 
			if(paramsTest.selectorFind[i] == "id"){
				test += "		wait.until(ExpectedConditions.visibilityOfElementLocated(By.id(\""+paramsTest.elementName[i] +"\")));\n";
				test += "		driver.findElement(By.id(\""+paramsTest.elementName[i]+"\"))";
				test =projectService.actionElement(test,paramsTest.selectorAction[i],paramsTest.elementText[i]);
			}else
			if(paramsTest.selectorFind[i] == "text"){
				test += "		wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath(\"//*[text()='"+paramsTest.elementName[i]+"']\")));\n";
				test += "		driver.findElement(By.xpath(\"//*[text()='"+paramsTest.elementName[i]+"']\"))";
				test =projectService.actionElement(test,paramsTest.selectorAction[i],paramsTest.elementText[i]);
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

		
		Test.findOne({parentId:parentId,name:nameTest,projectId:projectId}).exec(function(err,objTest){
			if(err){
				defer.reject(err);
			}else{
				if(objTest){
					defer.reject({message:"Error ya existe un test con ese nombre"});
				}else{
					projectService.getPath(parentId).then(function(objPath){
						console.info(objPath.path);
						pathProject += objPath.path;						
						projectService.createFile(pathProject+tmpl.name+".java").then(function(file){
							projectService.writeFile(pathProject+tmpl.name+".java",test).then(function(data){
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
		return defer.promise;	
	},

	runTest: function(){
 
 		var child = exec('cd /home/jose/Escritorio/Tilidom_TestNG  && bash -x prueba.sh',function (error, stdout, stderr) {
    		console.log('stdout: ' + stdout);
    		console.log('stderr: ' + stderr);
    		if (error !== null) {
     			 console.log('exec error: ' + error);
    		}
		});
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
		if(itemId=="0" || itemId == 0){
			defer.resolve({path:"/",pathArray:[]});
		}else{
			console.info("buscando itemId: "+itemId);
			Packet.findOne({id:itemId} ).exec(function(err,packet){
				if(err){
					defer.reject("");
				}else{
					console.info(packet);
					projectService.getPath(packet.parentId).then(function(objPath){
						objPath.path += packet.name+"/"
						objPath.pathArray.push({id:packet.id,name:packet.name});
						console.info(objPath);
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