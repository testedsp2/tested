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

  	projectService.contentProject(packetId,req.projectCurrent.id).then(function(tests){
      req.packetId = packetId;
      projectService.getPath(packetId).then(function(objPath){
        req.packetId = packetId;          		  
        return res.view({tests:tests,pathArray:objPath.pathArray});
      }).fail(function(err){
        return res.json(err);
      })
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
    var elementNameDesition= req.param("elementNameDesition");
    var packetId = req.param("packetId");
    var projectId = req.projectCurrent.id;
    if(packetId == undefined){
      packetId = "0";
    }

    if(typeof selectorFind != "object")
      selectorFind = [selectorFind];

    if(typeof elementName != "object")
      elementName = [elementName];

    if(typeof selectorAction != "object")
      selectorAction = [selectorAction];

    if(typeof elementText != "object")
      elementText = [elementText];

    if(typeof selectorFindDesition != "object")
      selectorFindDesition = [selectorFindDesition];

    if(typeof elementNameDesition != "object")
      elementNameDesition = [elementNameDesition];


    var paramsTest = {
    	url: url,
      selectorFind: selectorFind,
      elementName: elementName,
      selectorAction: selectorAction,
      elementText: elementText,
      selectorFindDesition: selectorFindDesition,
      elementNameDesition: elementNameDesition
    }
    projectService.createTest(projectId,packetId,nameTest,paramsTest,"firefox", true).then(function(data){
      res.json(200);
    }).fail(function(err){
      res.json(err);
    });
    projectService.createTest(projectId,packetId,nameTest,paramsTest,"chrome", false).then(function(data){
      res.json(200);
    }).fail(function(err){
      res.json(err);
    });
    projectService.createTest(projectId,packetId,nameTest,paramsTest,"opera", false).then(function(data){
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
      return res.json(err);
    });
  },
  dynamicTree:function(req,res){
    var packetId = req.param("packetId");
    var projectId = req.projectCurrent.id;
    projectService.dynamicTree(packetId,projectId).then(function(children){
      res.json(children);  
    }).fail(function(err){
      return res.json(err);
    })
    
  },

  getTree: function(req,res){
    var packetId = req.param("packetId");
    var projectId = req.projectCurrent.id;
    projectService.targetId = packetId;
    projectService.getTree(packetId,projectId).then(function(children){
      res.json(children);  
    }).fail(function(err){
      return res.json(err);
    })
  },

  getPath:function(req,res){
    var packetId = req.param("packetId");
    if(packetId == undefined){
       packetId = "0";
    }
    projectService.getPath(packetId).then(function(objPath){                    
        return res.json(objPath);
      }).fail(function(err){
        return res.json(err);
      })
  },

  contentProject:function(req,res){
  	var packetId = req.param("packetId");
  	projectService.contentProject(packetId).then(function(tests){
  		return res.json({tests:tests});
  	}).fail(function(err){
  		return res.json(err);
  	})
  },

  runTest: function(req,res){
    var testIds = req.param("testId");
    var packetId = req.param("packetId");
    if(typeof testIds != 'object'){
      testIds = [testIds];
    }
    var projectId = req.projectCurrent.id;
    console.log(projectId);
    projectService.runTest(testIds,packetId,projectId).then(function(data){
      res.json(data);
    }).fail(function(err){
      res.json(err);
    });
    
  },
  
  deleteTest: function(req,res){
    var testIds = req.param("testId");
    if(typeof testIds != 'object')
      testIds = [testIds];

    projectService.deleteItems(testIds).then(function(status){
      return res.json({status:0});  
    }).fail(function(err){
      return res.json({massage:"Error al eliminar"});  
    });    
    
  }

};

