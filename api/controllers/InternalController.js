/**
 * InternalController
 *
 * @description :: Server-side logic for managing internals
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var crypto = require("crypto");
module.exports = {
	


  /**
   * `InternalController.index()`
   */
  index: function (req, res) {
    var user = req.session.user;
    console.info(req.session.user);
    //console.info(user.firstName);
    res.view(
      {
        user: {
          firstName: user.firstName,
          email: user.email
        }
      }
    );

  },

 profile: function(req,res){
    var user = req.session.user;
    console.info(user);
    console.info(user.firstName);
    res.view(
      {
        user :{
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email
        }
      }
    );
  },

  newproject: function(req,res){
    var user = req.session.user;
    console.info(user);
    console.info(user.firstName);
    res.view(
      {
        user :{
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email
        }
      }
    );
  },
  /**
   * `InternalController.changeProfile()`
   */
  changeProfile: function (req, res) {
    var userID = req.session.user.id;
    var user = req.session.user;
    var firstName = req.param("firstNameProfile");   
    var lastName = req.param("lastNameProfile");
    var password = req.param("passwordProfile");
    var newPassword = req.param("newPasswordProfile");
    var confirmPassword = req.param("confirmPasswordProfile");
    if(newPassword!=confirmPassword){
      return res.json({
          message:"Error, password no coinciden"
      });
    }
    var shasum = crypto.createHash("sha1");
    var cryptoPass = shasum.update(password+user.salt).digest('hex').toUpperCase();

    console.info(password);
    console.info(user.salt);
    console.info(cryptoPass);
    console.info(userID);
    internalService.changeProfile(userID,firstName,lastName,cryptoPass,newPassword).then(function(data){
      if (data.status==0){
        return res.json(200);
      }else{
        return res.json({
            message:"Error,password incorrecto"
        });
      }
    }).fail(function(status){
      return res.json({
        message:"Error al modificar datos"
      });
    });
  },

  getUserInfo: function(req,res){
    res.json(req.session.user);
  }
};

