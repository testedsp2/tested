var crypto = require("crypto");
var Q = require("q");
module.exports = {
	changeProfile: function(userID,firstNameProfile,lastNameProfile,oldPasswordProfile,newPasswordProfile){
		var defer = Q.defer();
		User.findOne(
			{id:userID,
				password:oldPasswordProfile
			 }
			 ).exec(function(err,user){
					if (err) {
						defer.reject(err);

					}else{
						//console.log(user);
						if (user) {
							var salt = Date.now().toString();
					        var shasum = crypto.createHash("sha1");
					        user.salt = shasum.update(salt).digest('hex').toUpperCase();
   							var shasum2 = crypto.createHash("sha1");
   							var cryptoPassNew = shasum2.update(newPasswordProfile+user.salt).digest('hex').toUpperCase();
							user.firstName = firstNameProfile;
							user.lastName = lastNameProfile;
							user.password = cryptoPassNew;
							user.save(function(err){
								if (err) {
									defer.reject(err);
								}else{
									defer.resolve({status:0});
								};
							});
						}else{
							defer.resolve({status:1});
						}
				};
			});
		return defer.promise;
	},

	createProject: function(userID,name,description){
		var defer = Q.defer();
		var project = {
      		name:name.trim(),
     		description:description.trim(),
     		ownerId:userID,
      		owner:userID
    	};
    	Project.findOne({ownerId:userID,name:name}).exec(function(err,proj){
    		if(err){
    			defer.reject(err);
    		}else{
    			if(proj){
    				defer.reject({message:"Error el nombre del proyecto ya esta en uso"});
    			}else{
			    	Project.create(project).exec(function(err,project){
				      	if(err){
				        	defer.reject({message:"Error al inicializar el proyecto"});
				      	}else{
				      		projectService.createProjectRoot(project.id,project.name).then(function(data){
				      			defer.resolve({status:0});
				      		}).fail(function(err){
				      			defer.reject(err);
				      			//defer.reject({message:"Error al inicializar el proyecto"});
				      		});
				        	
				      	}
			    	});
    			}
    		}
    	});
    	return defer.promise;
	},

	getProjectsUser: function(userId){
		var defer = Q.defer();
		User.findOne({id:userId}).populate('projects').exec(function(err,data){
			if(err){
				defer.reject({message:"Error al obtener los datos"});
			}else{				
				defer.resolve({status:0,projects:data.projects});				
			}
		});
		return defer.promise;
	}
};