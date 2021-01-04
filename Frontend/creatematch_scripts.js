$(document).ready(function(){
    $('#submit').click(function () {
       
        $("span").remove("#error-msg2");
            if(!validateTeams()){
                return false;
            }
            $("#Submitform").submit(function(event) {
                // Prevent the form from submitting via the browser.

                event.preventDefault();
                sendJSON();
                validator.resetForm();
            })
        return true; 
      
    });
})

function validateTeams(){
    var team1=$('#selType').val();
    var team2=$('#selType2').val();
    if(team1==team2){
        $("#selType2").after('<span id="error-msg2">Home and Away teams can not be the same</span>');
        return false;
    }
    return true;
}


function sendJSON(){ 
               
    let team1 = document.querySelector('#selType'); 
    let team2 = document.querySelector('#selType2'); 
    let date = document.querySelector('#birthdaytime');
    let stadium = document.querySelector('#stadium');
    let referee = document.querySelector('#selType3');
    let linesman1 = document.querySelector('#selType4');
    let linesman2 = document.querySelector('#selType5');
    var matchTime = date.value+":00.000+00:00"
    // Creating a XHR object 
    let xhr = new XMLHttpRequest(); 
    let url = "http://localhost:8080/manager/addMatch"; 

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
            alert("Match added successfully"); 
            window.location.replace("/Home.html");
            return true;

        }
        else if(xhr.readyState === 4 && xhr.status !== 200)
        {
            
            var responseObj = JSON.parse(this.responseText)
            message = responseObj.msg;
            $('#error-msg').addClass("error-text");
            $('#error-msg').text(message);
            $('#error-msg').show();
            //alert(message); 
            return false;
        }
    };

    var data = JSON.stringify({ "HomeTeam": team1.value, "AwayTeam":team2.value,"MatchVenue":stadium.value,"Date":matchTime,"MainReferee":referee.value,"LinemanOne":linesman1.value,"LinemanTwo":linesman2.value});
    xhr.send(data);
} 