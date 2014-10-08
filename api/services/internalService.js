var Q = require("q");
module.exports = {
	changeProfile: function(userID,firstNameProfile,lastNameProfile,passwordProfile){
		var defer = Q.defer();
		User.update(
			{_id:userID},
			{$set:
				{
					firstName:firstNameProfile,
					lastName:lastNameProfile,
					password:passwordProfile
				}
			}
		).done(function(err,user){
			if (err) {
				defer.reject(err);
			}else{
				defer.resolve({status:0});
			};
		});
		return defer.promise;
	}
};