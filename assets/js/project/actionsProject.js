var initActionProjects = function(){
	var projectName = $("#containerProject").attr("rel");
	var packetId = Options.packetId;
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


}

initActionProjects();