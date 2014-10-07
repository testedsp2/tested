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


  /**
   * `InternalController.changeProfile()`
   */
  changeProfile: function (req, res) {
    return res.json({
      todo: 'changeProfile() is not implemented yet!'
    });
  }
};

