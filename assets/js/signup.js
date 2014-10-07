var signUp = function(){
	 $("#registerModalForm input").jqBootstrapValidation(
    {
        preventSubmit: true,
        submitSuccess: function ($form, event) {
             event.preventDefault();
            var params = $form.serializeArray();
            console.info(params);             
            $.post("/signup/register",params, function(data) {
            if(data.status == 0 ) {
                console.info("login");
                $("#errorAlertRegister").css("display","none");
            } else {
                $("#errorAlertRegister").css("display","block");
                $("#errorAlertRegister").text(data.message);
                window.location = '/';

            }
        });
        }
    });    
}
signUp();