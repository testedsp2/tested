/**
 * InternalController
 *
 * @description :: Server-side logic for managing internals
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

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

  /**
   * `InternalController.changeProfile()`
   */
  changeProfile: function (req, res) {
    var userID = req.session.user.id;
    var firstName = req.param("firstNameProfile");   
    var lastName = req.param("lastNameProfile");
    var password = req.param("passwordProfile");
    internalService.changeProfile(userID,firstName,lastName,password).then(function(status){
      return res.json(200);
    }).fail(function(status){
      return res.json({
        message:"Error al modificar datos"
      });
    });
  }

  getUserInfro: function(req,res){
    res.json(req.session.user);
  }
};

