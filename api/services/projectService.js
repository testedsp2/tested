var fs = require('fs');
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
				defer.resolve({status:0});
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
		return defer.promise;	}
};