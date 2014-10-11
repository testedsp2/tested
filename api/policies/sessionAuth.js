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
  if (isAuthenticated()) {  
  	req.user = req.session.user;  	
    User.findOne({id:req.user.id}).exec(function(err,user){
      if(err){      
        return res.redirect("/");
      }else{
        req.session.user = user;

        
        internalService.getProjectsUser(req.user.id).then(function(data){
          req.projects = data.projects;
          //console.info(req.projects);
          return next();
        }).fail(function(err){
          req.logout();
          return res.redirect("/");
        });
      }
    });
  }else{
      return res.redirect("/");
  }

  
  // User is not allowed
  // (default res.forbidden() behavior can be overridden in `config/403.js`)
  //return res.forbidden('You are not permitted to perform this action.');
};


