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
		$.post("/tested/"+projectName+"/create-test",params,function(data){
			if(data==200){
				alert("test creado");
				window.location = "/tested/"+projectName;
			}else{
				alert(data);
			}
		});
	});
	$("#btnCancelar").click(function(){		
		var projectName = $("#formTest").attr("rel");
		window.location = "/tested/"+projectName;
	});
	
}


actionsTestsTable();
