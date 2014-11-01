/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes map URLs to views and controllers.
 *
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.)
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `api/responses/notFound.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
 * CoffeeScript for the front-end.
 *
 * For more information on configuring custom routes, check out:
 * http://sailsjs.org/#/documentation/concepts/Routes/RouteTargetSyntax.html
 */

module.exports.routes = {

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` (or `views/homepage.jade`, *
  * etc. depending on your default view engine) your home page.              *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/

  '/': {
    view: 'home/index'
  },
  '/tested':{
    controller: 'InternalController',
    action: 'index'
  },
   '/tested/profile':{
    controller: 'InternalController',
    action: 'profile'
  },
   '/tested/newproject':{
    controller: 'InternalController',
    action: 'newproject'
  },
   '/tested/:projectName':{
    controller: 'ProjectController',
    action: 'index'
  },

  '/tested/:projectName/:packetId':{
    controller: 'ProjectController',
    action: 'index'
  },
  
  '/tested/:projectName/:packetId/newtest':{
    controller: 'ProjectController',
    action: 'newtest'
  },  

  '/tested/:projectName/:packetId/create-test':{
    controller: 'ProjectController',
    action: 'createTest'
  },

  '/tested/:projectName/:packetId/newpacket':{
    controller: 'ProjectController',
    action: 'newpacket'
  },

  'post /tested/:projectName/:packetId/createPacket':{
    controller: 'ProjectController',
    action: 'createPacket'
  },
  'post /tested/:projectName/:packetId/runTest':{
    controller: 'ProjectController',
    action: 'runTest'
  },

  'post /tested/:projectName/:packetId/deleteTest':{
    controller: 'ProjectController',
    action: 'deleteTest'
  },

  'post /tested/:projectName/:packetId/dynamicTree':{
    controller: 'ProjectController',
    action: 'dynamicTree'
  },

  'post /tested/:projectName/:packetId/getPath':{
    controller: 'ProjectController',
    action: 'getPath'
  },
  'post /tested/:projectName/:packetId/getTree':{
    controller: 'ProjectController',
    action: 'getTree'
  },
  '/tested/:projectName/:packetId/reports':{
    controller: 'ProjectController',
    action: 'reports'
  },
  'post /tested/:projectName/:packetId/getReports':{
    controller: 'ProjectController',
    action: 'getReports'
  },


  /***************************************************************************
  *                                                                          *
  * Custom routes here...                                                    *
  *                                                                          *
  *  If a request to a URL doesn't match any of the custom routes above, it  *
  * is matched against Sails route blueprints. See `config/blueprints.js`    *
  * for configuration options and examples.                                  *
  *                                                                          *
  ***************************************************************************/

};
