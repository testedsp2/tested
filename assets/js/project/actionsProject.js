var actionProject = {

	projectName : $("#containerProject").attr("rel"),
	packetId : Options.packetId,
	tree : null,

	initActionProjects : function(){
	var projectName = actionProject.projectName;
	var packetId = actionProject.packetId;
	$("#runTests").css("display","none");
	$("#deleteTests").css("display","none");
	$(".checkFile").on("click",function(){
		var n = $(".checkFile:checked").length;
		if(n>0){
			$("#runTests").css("display","");
			$("#deleteTests").css("display","");
		}else{
			$("#runTests").css("display","none");
			$("#deleteTests").css("display","none");
		}
		});	

		var execAction = function(url,cb){
			var checkes = $(".checkFile:checked");
			var params = [];
			for (var i = 0; i < checkes.length; i++) {
				params.push({
					name:"testId",
					value: $(checkes[i]).attr("rel")
				});
			};
			console.info(params);
			$.post(url,params,cb);
		
		}

		$("#runTests").on("click",function(){
			execAction("/tested/"+projectName+"/"+packetId+"/runTest",function(data){

			});
		});
		$("#deleteTests").on("click",function(){
			execAction("/tested/"+projectName+"/"+packetId+"/deleteTest",function(data){
				if(data.status == 0){
					alert("Objeto Eliminado");
					location.reload();
				}else{
					alert(data.message);
				}
			});
		});

		$(".btnRunTest").on("click",function(){
			var testId = $(this).attr("rel");
			var params = [{
					name:"testId",
					value: testId
				}];
			$.post("/tested/"+projectName+"/"+packetId+"/runTest",params,function(data){
				
			});
		});
		$(".btnDeleteTest").on("click",function(){
			var test = $(this);
			var testId = $(test).attr("rel");
			var params = [{
					name:"testId",
					value: testId
				}];
			$.post("/tested/"+projectName+"/"+packetId+"/deleteTest",params,function(data){
				if(data.status == 0){
					alert("Objeto Eliminado");
					location.reload();
				}else{
					alert(data.message);
				}
			});
		});

		$.post("/tested/"+projectName+"/"+packetId+"/getPath", function(data){
			actionProject.tree = $("#tree").dynatree({	        	
				initAjax: {
					url: "/tested/"+projectName+"/"+packetId+"/getTree",
			        method:"post",
				},
	        	onCreate: function(node){
	        		/*console.info(node.data);
	        			node.data.active = node.data.key == packetId;	        			
	        		
	        		var isActual = node.data.key == "0";	        		
	        		for (var i = 0; i < data.pathArray.length; i++) {
	        			console.info(data.pathArray[i].id+"=="+node.data.key);
	        			isActual |= data.pathArray[i].id == node.data.key
	        		};
	        		if(isActual ){
	        			node.appendAjax({
		        	 		url: "/tested/"+projectName+"/"+node.data.key+"/dynamicTree",
		        	 		method:"post"
	        	 		});
	        		}*/

	        	}, 

	        	onLazyRead: function(node){
			        node.appendAjax({
			        	url: "/tested/"+projectName+"/"+node.data.key+"/dynamicTree",
			        	method:"post",
	                   	//data: { // Optional url arguments
	                     //     },                   
						//dataType: "jsonp",
	                   	success: function(node,nodeData) {
	                    	//console.info(node);
	                    },
	                   	error: function(node, XMLHttpRequest, textStatus, errorThrown) {
	                       // Called on error, after error icon was created.
	                    },
	                   	//cache: false // Append random '_' argument to url to prevent caching.
	                  });
			    },
				onActivate: function(node) {
	                // A DynaTreeNode object is passed to the activation handler
	                // Note: we also get this event, if persistence is on, and the page is reloaded.
	                console.info("You activated " + node.data.title);
	               // node.removeChildren();

	                
	            },
	            persist: true,
	            isLazy : true,	            
	            /*children: [
	            	{
		            	title    : "root",
		            	isFolder : true,
		            	isLazy   : true,
		            	key      : "0",
		            	expand   : true
	            	}
	            ]*/
	        });
		});
		


	}
};



	
	

		

        // Attach the dynatree widget to an existing <div id="tree"> element
        // and pass the tree options as an argument to the dynatree() function:
       
    



actionProject.initActionProjects();