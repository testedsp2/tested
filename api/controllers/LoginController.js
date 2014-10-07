/**
 * LoginController
 *
 * @description :: Server-side logic for managing logins
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var passport = require("passport");
 module.exports = {
    
    process: function(req,res){
        passport.authenticate('local', function(err, user, info) {
            if ((err) || (!user)) {
                var msg = {"message": "Email or Password are incorrect"};
                return res.json(msg);
            }
            req.logIn(user, function(err) {
                if (err) res.json(err);        
                    return res.json(200);
            });
        })(req, res);  
    }

 };

