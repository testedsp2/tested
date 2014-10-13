
var fs = require('fs-extra');
var Q = require('q');

module.exports = {
	cprf: 'content-project',
	templateTest : {
  		imports: ["org.testng.*","org.openqa.selenium.*"],
  		name:"prueba",//camibiara
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
				projectService.getPath(parentId).then(function(path){
					console.info(path);
					pathPacket += path;
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

				}).fail(function(err){
					
				})

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
		//fs.createReadStream(tmpPath).pipe(fs.createWriteStream(newPath));
	},
	createTest: function(projectId,parentId,nameTest,paramsTest){
		var defer = Q.defer();
		var projectId = projectId
		var pathProject = projectService.cprf+"/"+projectId+"/src/"
		
		var tmpl = projectService.templateTest;
		var time = 15;
		tmpl.name= nameTest;
		var test ="";
		for (var i = 0; i < tmpl.imports.length; i++) {
			test += "import "+tmpl.imports[i]+";\n";
		};
		test += "public class "+ tmpl.name +"{\n";
		test += "@Test\n";
		test += "public void "+ tmpl.name +"_test(){\n";
		test += "WebDriver driver = new FirefoxDriver();\n";
		test += "WebDriverWait wait = new WebDriverWait(driver,15);\n";
		test += "driver.get(\""+paramsTest.url+"\");\n";
		test += "driver.close();\n}\n}";

		Packet.findOne({id:parentId}).exec(function(err,packet){
			if(err){
				defer.reject(err);
			}else{
				if(packet){
					pathProject += packet.name +"/";
				}
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
				
			}
		});
		return defer.promise;	
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
	contentProject: function(parentId){
		var defer = Q.defer();
		Test.find({parentId:parentId}).exec(function(err,tests){
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
		console.info("itemId: "+itemId);
		if(itemId=="0" || itemId == 0){
			defer.resolve("/");
		}else{
			console.info("buscando itemId: "+itemId);
			Packet.findOne({id:itemId} ).exec(function(err,packet){
				if(err){
					defer.reject("");
				}else{
					console.info(packet);
					projectService.getPath(packet.parentId).then(function(path){
						console.info("getPath: "+ path);
						defer.resolve(path+packet.name+"/");
					}).fail(function(err){
						defer.reject(err);
					})
				}
			});
		}
		return defer.promise;
	}
};