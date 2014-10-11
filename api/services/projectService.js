var fs = require('fs-extra');
var Q = require('q');

module.exports = {
	cprf: 'content-project',
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
				console.info(data);
				projectService.listFiles("libs").then(function(files){
					console.info(files);
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
			    })
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
	}
};