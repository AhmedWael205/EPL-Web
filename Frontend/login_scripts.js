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
               
    let username = document.querySelector('#username'); 
    let password = document.querySelector('#password'); 

       
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

            window.location.replace("http://127.0.0.1:5500/Home.html")
            return true;

        }
        else if(xhr.readyState === 4 && xhr.status !== 200)
        {
            var responseObj = JSON.parse(this.responseText)
            message = responseObj.msg;

            if(message = "UserNotFound")
            {
                // Do some logic ya Hamda
            }
            else if (message = "IncorrectPassword")
            {
                // Do some logic ya Hamda
            }
            else
            {
                // Not Valid ( ex: username mafhosh number, password mafhosh Capital)
            }
            return false;
        }
    };

    var data = JSON.stringify({ "Username": username.value, "Password":password.value});

    xhr.send(data);
} 