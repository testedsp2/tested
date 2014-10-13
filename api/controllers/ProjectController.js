/**
 * ProjectController
 *
 * @description :: Server-side logic for managing projects
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	


  /**
   * `ProjectController.index()`
   */
  index: function (req, res) {
    var packetId = req.param("packetId");
    if(packetId == undefined){
  	   packetId = "0";
    }

  	projectService.contentProject(packetId).then(function(tests){
      req.packetId = packetId;
  		return res.view({tests:tests});
  	}).fail(function(err){
  		return res.json(err);
  	})
    
  },
  newtest: function(req,res){
    res.view();
  },

  newpacket: function(req,res){
    res.view();
  },

  createTest: function(req,res){
    var url = req.param("urlTest");
    var nameTest = req.param("nameTest");
    var selectorFind = req.param("selectorFind");
    var elementName = req.param("elementName");
    var selectorAction = req.param("selectorAction");
    var elementText = req.param("elementText");
    var selectorFindDesition = req.param("selectorFindDesition");
    var elementNameDesiton= req.param("elementNameDesiton");
    var packetId = req.param("packetId");
    var projectId = req.projectCurrent.id;
    if(packetId == undefined){
      packetId = "0";
    }
    var paramsTest = {
    	url: url
    }
    projectService.createTest(projectId,packetId,nameTest,paramsTest).then(function(data){
      res.json(200);
    }).fail(function(err){
      res.json(err);
    });

  },

  createPacket:function(req,res){
    var packetName = req.param("packetName");
    var packetId = req.param("packetId");
    var projectId = req.projectCurrent.id;
    if(packetId == undefined){
      packetId = 0;
    }

    projectService.createPackage(projectId,packetId,packetName).then(function(data){
      return res.json({status:0});
    }).fail(function(err){
      return res.json({message:"No se pudo crear el paquete"});
    });
  },

  contentProject:function(req,res){
  	var packetId = req.param("packetId");
  	projectService.contentProject(packetId).then(function(tests){
  		return res.json({tests:tests});
  	}).fail(function(err){
  		return res.json(err);
  	})
  },
};

