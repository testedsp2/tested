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

  // User is allowed, proceed to the next policy, 
  // or if this is the last policy, the controller
  console.info("entro a session");
  console.info(req._passport);
  console.info(req._passport.instance._framework.authenticate);
  console.info(req._passport.instance._strategies);
  console.info(req.locals);
  return res.json(req._passport);
  if (req.session.authenticated) {
  	console.info("entro a authenticated");
  	req.user = req.session.passport.user;  	

    return next();
  }

  // User is not allowed
  // (default res.forbidden() behavior can be overridden in `config/403.js`)
  return res.forbidden('You are not permitted to perform this action.');
};
