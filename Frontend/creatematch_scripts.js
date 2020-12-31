$(document).ready(function(){
    $('#submit').click(function () {
        $("span").remove("#error-msg");
        if(!validateTeams()){
            return false;
        }
        $("#Submitform").submit(function(event) {
            // Prevent the form from submitting via the browser.
            event.preventDefault();
            sendJSON();
        })
      
    });
})

function validateTeams(){
    var team1=$('#selType').val();
    var team2=$('#selType2').val();
    if(team1==team2){
        $("#selType2").after('<span id="error-msg">Home and Away teams can not be the same</span>');
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
    alert('team1');

    
/*
       
    // Creating a XHR object 
    let xhr = new XMLHttpRequest(); 
    let url = "http://localhost:8080/accounts/signin"; 

    // open a connection 
    xhr.open("POST", url, true); 

    // Set the request header i.e. which type of content you are sending 
    xhr.setRequestHeader("Content-Type", "application/json");


    // Create a state change callback 
    xhr.onreadystatechange = function () { 
        if (xhr.readyState === 4 && xhr.status === 200) { 

            // Print received data from server            
            var responseObj = JSON.parse(this.responseText)
            token = responseObj.token;
            localStorage.setItem("token", token);

            window.location.replace("/Home.html");
            return true;

        }
        else if(xhr.readyState === 4 && xhr.status !== 200)
        {
            var responseObj = JSON.parse(this.responseText)
            message = responseObj.msg;

            if(message = "UserNotFound")
            {
                // Do some logic ya Hamda
                alert(message)
            }
            else if (message = "IncorrectPassword")
            {
                // Do some logic ya Hamda
                alert(message)

            }
            else
            {
                // Not Valid ( ex: username mafhosh number, password mafhosh Capital)
            }
            return false;
        }
    };

    var data = JSON.stringify({ "Username": username.value, "Password":password.value});

    xhr.send(data);*/
} 