/**
 * sessionAuth
 *
 * @module      :: Policy
 * @description :: Simple policy to allow any authenticated user
 *                 Assumes that your login action in one of your controllers sets `req.session.authenticated = true;`
 * @docs        :: http://sailsjs.org/#!documentation/policies
 *
 */
var Q = require('q');
module.exports = function(req, res, next) {
  var isAuthenticated = function(){
    return req.session.passport.user != undefined
  }

  var projectCurrent = function(userId){
    var defer = Q.defer();
    var name = req.params["projectName"];
    Project.findOne({ownerId:userId,name:name}).exec(function(err,proj){
        if(err){
          defer.reject(err);
        }else{          
          defer.resolve(proj);
        }
    });
    return defer.promise;
  }

  var projectsList = function(userId){
    internalService.getProjectsUser(userId).then(function(data){
          req.projects = data.projects;
          //console.info(req.projects);
          return next();
        }).fail(function(err){
          req.logout();
          return res.redirect("/");
        });
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
        if(req.options.controller == "project"){
          projectCurrent(req.user.id).then(function(proj){
            req.projectCurrent = proj;
            req.packetId = req.param("packetId");
            if(req.packetId != undefined){
              req.packetId = req.packetId.toString();
            }            
            projectsList(req.user.id);  
          }).fail(function(err){
            res.status(500);
            return res.next();
            return res.json(err);   
          });
        }else{
          projectsList(req.user.id);
        }
        
        
      }
    });
  }else{
      return res.redirect("/");
  }

  
  // User is not allowed
  // (default res.forbidden() behavior can be overridden in `config/403.js`)
  //return res.forbidden('You are not permitted to perform this action.');
};


