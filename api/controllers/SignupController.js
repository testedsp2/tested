/**
 * SignupController
 *
 * @description :: Server-side logic for managing signups
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

	register: function(req,res){
		var firstName = req.param("firstNameRegister");
		var lastName = req.param("lastNameRegister");
		var email = req.param("emailRegister");
		var confirmEmail = req.param("confirmEmailRegister");
		var password = req.param("passwordRegister");
		var confirmPassword = req.param("confirmPasswordRegister");

		var objUser = {
			firstName: firstName,
			lastName: lastName,
			email: email,
			password: password,
			rol: 'u'
		};

		User.create(objUser).then(function(user){
			return res.json({status:0,message:"OK"})
		}).catch(function(err){
			console.info("--------------------------------");
			console.info(err);
			return res.json({status:1,message:"Error al crear el usuario"});
		})
	}	
};

