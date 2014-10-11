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
}


actionsTestsTable();
