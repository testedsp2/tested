var loginInit = function () {    
   /*$("#loginModalForm").on("submit", function (event) {
        var params = $("#loginModalForm").serializeArray();
        
        $.post("/login/process",params, function(data) {
            if(data.status == 0 ) {
                console.info("login");
            } else {
                console.info("no login");
            }
        });
        
    });*/
    $("#loginModalForm input").jqBootstrapValidation(
    {
        preventSubmit: true,
        submitSuccess: function ($form, event) {
             event.preventDefault();
            var params = $form.serializeArray();
            console.info(params);            
            $.post("/login/process",params, function(data) {
            if(data == 200) {
                console.info("login");
                window.location = "/tested";
            } else {
                console.info("no login");
                $("#errorLogin").css("display","");
                $("#errorLoginText").text(data.message);
            }
        });
        }
    }); 

    $('#loginModal').on('show.bs.modal', function (e) {        
        $("#errorLogin").css("display","none");
        $("#errorLoginText").text("");
    });
};
loginInit();