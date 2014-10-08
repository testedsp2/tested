var profileInfo = function(){
	 $("#profileInfoForm input").jqBootstrapValidation({
        preventSubmit: true,
        submitSuccess: function ($form, event) {
             event.preventDefault();
            var params = $form.serializeArray();
            $.post("/internal/changeProfile",params,function(data){
				if(data == 200){
					$('#errorAlertProfile').css("display",'');
					$('#textErrorAlertProfile').text("Se Modifico la informacion correctamente");
				}else{
					$('#errorAlertProfile').css("display",'');
					$('#textErrorAlertProfile').text("No se lograron guardar los datos correctamente");
				}
			});
        }
    }); 
}

profileInfo();

