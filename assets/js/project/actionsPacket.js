var initActionPacket = function(){
	 $("#newPacketForm input").jqBootstrapValidation({
        preventSubmit: true,
        submitSuccess: function ($form, event) {
             event.preventDefault();
            var params = $form.serializeArray();
            var btn = $("#btnSave")
    		btn.button('loading');
    		var projectName = $("#newPacketForm").attr("rel");
    		var packetId = Options.packetId;
            $.post("/tested/"+projectName+"/"+packetId+"/createPacket",params,function(data){
				if(data.status == 0){
					$('#successAlertNewPacket').css("display",'');
					$('#textSuccessAlertNewPacket').text("Se creo correctamente el packete");
					window.location = '/tested/'+projectName;
				}else{
					$('#errorAlertNewPacket').css("display",'');
					$('#textErrorAlertNewPacket').text(data.message);
				}
				btn.button('reset');
			});
        }
    }); 
}

initActionPacket();