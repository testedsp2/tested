
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
	createPackage: function(packageName,projectID){
		var defer = Q.defer();
		Project.findOne({id:projectID}).exec(function(err,project){
			var nameRoot = projectID + "_" + project.name;
			if(err){
				defer.reject({message: "No se logro crear el paquete"});
			}else{
				fs.mkdir(projectService.cprf+"/"+project.name/packageName,function(err,data){
				});
			}
		});

	},

	createProjectRoot: function(projectID,projectName){
		var defer = Q.defer();
		var nameRoot = projectID + "_" + projectName;
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
						defer.reject({message:"No se logro crear enlaces simbolicos"});	
					});			
			    }).fail(function(err){
			      	defer.reject({message:"No se logro obtener el listado de archivos"});
			    });
			}).fail(function(err){
				defer.reject({message:"No se logro crear el folder"});
			});
		}).fail(function(err){
			defer.reject({message:"No se logro crear el folder"});
		});
		
		return defer.promise;
	},

	createFolder: function(path,folderName){
		var defer = Q.defer();
		fs.mkdir(path+"/"+folderName,function(err,data){
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
	createTest: function(url){
		var defer = Q.defer();
		var tmpl = projectService.templateTest;
		var time = 15;
		var test = "";
		for (var i = 0; i < tmpl.imports.length; i++) {
			test += "import "+tmpl.imports[i]+";\n";
		};
		test += "public class "+ tmpl.name +"{\n";
		test += "@Test\n";
		test += "public void "+ tmpl.name +"_test(){\n";
		test += "WebDriver driver = new FirefoxDriver();\n";
		test += "WebDriverWait wait = new WebDriverWait(driver,15);\n";
		test += "driver.get(\""+url+"\");\n";
		test += "driver.close();\n}\n}";
		projectService.createFile(projectService.cprf+"/"+tmpl.name+".java").then(function(file){
			projectService.writeFile(projectService.cprf+"/"+tmpl.name+".java",test).then(function(data){
				defer.resolve({stats:0});
			}).fail(function(err){
				defer.reject(err);
			});
		}).fail(function(err){
			defer.reject(err);
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
	}
};