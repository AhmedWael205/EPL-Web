$(document).ready(function(){
    $('#submit').click(function () {
        $("#Submitform").submit(function(event) {
            // Prevent the form from submitting via the browser.
            event.preventDefault();
            sendJSON();
        })
      
    });
})


function sendJSON(){ 
    //alert("sending");
               
    let StadName = document.querySelector('#stadname'); 
    let rows = document.querySelector('#nrows'); 
    let seatsrow = document.querySelector('#nseats');
    // Creating a XHR object 
    let xhr = new XMLHttpRequest(); 
    let url = "http://localhost:8080/manager/addStadium"; 

    // open a connection 
    xhr.open("POST", url, true); 

    // Set the request header i.e. which type of content you are sending 
    var token = localStorage.getItem("token");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("token", token);


    // Create a state change callback 
    xhr.onreadystatechange = function () { 
        if (xhr.readyState === 4 && xhr.status === 200) { 
           
            // Print received data from server          
            var responseObj = JSON.parse(this.responseText);
            window.location.replace("/Home.html");
            return true;

        }
        else if(xhr.readyState === 4 && xhr.status !== 200)
        {
            var responseObj = JSON.parse(this.responseText)
            $('#error-msg').addClass("error-text");
            $('#error-msg').text(responseObj.msg);
            $('#error-msg').show();
            return false;
        }
    };
    
    var data = JSON.stringify({ "Name": StadName.value, "Length":seatsrow.value,"Width":rows.value});
    xhr.send(data);
} 