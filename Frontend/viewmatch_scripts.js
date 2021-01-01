$(document).ready(function(){
    $('#submit').click(function () {
        $("#Submitform").submit(function(event) {
            event.preventDefault();
            sendJSON();
        })
      
    });
})

