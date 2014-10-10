var createNewProject = function(){
	 $("#newProjectForm input").jqBootstrapValidation({
        preventSubmit: true,
        submitSuccess: function ($form, event) {
             event.preventDefault();
            var params = $form.serializeArray();
            $.post("/internal/createProject",params,function(data){
				if(data == 200){
					$('#successAlertNewProject').css("display",'');
					$('#textSuccessAlertNewProject').text("Se creo correctamente el proyecto");
					window.location = '/tested/newtest';
				}else{
					$('#errorAlertNewProject').css("display",'');
					$('#textErrorAlertNewProject').text(data.message);
				}
			});
        }
    }); 
}

createNewProject();