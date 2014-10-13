var actionsTestsTable = function(){
	$("#addAction").click(function(){
		$("#template-row-form-tests").tmpl().appendTo("#table-generate-test-actions");
	});

	$("#table-generate-test-actions").on('click','.deleteRow',function(){
		$(this).parent().parent().remove();
	});

	$("#addDesition").click(function(){
		$("#template-desition-form-tests").tmpl().appendTo("#table-generate-test-desition");
	});

	$("#table-generate-test-desition").on('click','.deleteRow',function(){
		$(this).parent().parent().remove();
	});

	$("#btnSaveGenerateTest").click(function(){
		var params = $("#formTest").serializeArray();
		var projectName = $("#formTest").attr("rel");		
		var packetId = Options.packetId;
		$.post("/tested/"+projectName+"/"+packetId+"/create-test",params,function(data){
			if(data==200){
				$('#successAlertNewTest').css("display",'');
				$('#textSuccessAlertNewTest').text("Se creo correctamente el packete");
				window.location = "/tested/"+projectName+"/"+packetId+"/";
			}else{
				$('#errorAlertNewTest').css("display",'');
				$('#textErrorAlertNewTest').text(data.message);
			}
		});
	});
	$("#btnCancelar").click(function(){		
		var projectName = $("#formTest").attr("rel");
		var packetId = Options.packetId;
		window.location = "/tested/"+projectName+"/"+packetId+"/";
	});
	
}


actionsTestsTable();
