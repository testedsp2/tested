var Q = require("q");
module.exports = {
	changeProfile: function(userID,firstNameProfile,lastNameProfile,oldPasswordProfile,newPasswordProfile,){
		var defer = Q.defer();
		User.findOne(
			{_id:userID,
			 	password:oldPasswordProfile
			 }
			 ).done(function(err,user){
					if (err) {
						defer.reject(err);

					}else{
						if (user) {
							var salt = Date.now().toString();
					        var shasum = crypto.createHash("sha1");
					        user.salt = shasum.update(salt).digest('hex').toUpperCase();
   							var shasum2 = crypto.createHash("sha1");
   							var cryptoPassNew = shasum.update(newPasswordProfile+user.salt).digest('hex').toUpperCase();
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
	}
};