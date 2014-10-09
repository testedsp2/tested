/**
 * sessionAuth
 *
 * @module      :: Policy
 * @description :: Simple policy to allow any authenticated user
 *                 Assumes that your login action in one of your controllers sets `req.session.authenticated = true;`
 * @docs        :: http://sailsjs.org/#!documentation/policies
 *
 */
module.exports = function(req, res, next) {
  var isAuthenticated = function(){
    return req.session.passport.user != undefined
  }
  // User is allowed, proceed to the next policy, 
  // or if this is the last policy, the controller
  console.info("entro a session");
  console.info(req.session);
  if (isAuthenticated()) {
  	console.info("entro a authenticated");
  	req.user = req.session.user;  	
    User.findOne({id:req.user.id}).exec(function(err,user){
      if(err){
        console.log(err);
        return res.redirect("/");
      }else{
        req.session.user = user;
        return next();
      }
    });
  }else{
      return res.redirect("/");
  }

  
  // User is not allowed
  // (default res.forbidden() behavior can be overridden in `config/403.js`)
  //return res.forbidden('You are not permitted to perform this action.');
};


