$(document).ready(function(){
    sendJSON();
})
function Confirm(){ 
    // Creating a XHR object 
    let xhr = new XMLHttpRequest(); 
    let url = "http://localhost:8080/fan/editData"; 
    
    // open a connection 
    xhr.open("PUT", url, true); 
    
    var token = localStorage.getItem("token");

    xhr.setRequestHeader("token", token);
    // DO some logic with These information ya Hamada
    
    xhr.onreadystatechange = function () { 
        if (xhr.readyState === 4 && xhr.status === 200) { 
    
            // Print received data from server            
            var responseObj = JSON.parse(this.responseText);
            alert('Your data updated successfully');
            return true;
    
        }
        else if(xhr.readyState === 4 && xhr.status !== 200)
        {
            alert('error');
          // Note ya Hamada: in Some other APIs you may have to check for each status (400, 401, 403, 404, 500)
            return false;
        }
    };
    
    xhr.send();
    }
    


function sendJSON(){ 
    // Creating a XHR object 
    let xhr = new XMLHttpRequest(); 
    let url = "http://localhost:8080/fan/data"; 
    
    // open a connection 
    xhr.open("GET", url, true); 
    
    var token = localStorage.getItem("token");

    xhr.setRequestHeader("token", token);
    // DO some logic with These information ya Hamada
    
    xhr.onreadystatechange = function () { 
        if (xhr.readyState === 4 && xhr.status === 200) { 
    
            // Print received data from server            
            var responseObj = JSON.parse(this.responseText);
            var d = new Date(responseObj.Birthdate);
            //alert(responseObj.Firstname);
            $('#Submitform').append('<p id="firstname">Your First name : '+responseObj.Firstname+'</p>');
            $('#firstname').append('<input style="display:block;"id="changefirstname" type="button" value="Edit First Name" />');

            $('#firstname').append('<p id="lastname">Your Last name : '+responseObj.Lastname+'</p><br>');
            $('#lastname').append('<input style="display:block;"id="changelastname" type="button" value="Edit Last Name" />');

            $('#lastname').append('<p id="birthdate">Your Birthdate : '+d.toDateString()+'</p>');
            $('#birthdate').append('<input style="display:block;"id="changebd" type="button" value="Edit Birthdate" />');

            $('#birthdate').append('<p id="city">Your city : '+responseObj.City+'</p>');
            $('#city').append('<input style="display:block;"id="changecity" type="button" value="Edit City" />');

            $('#city').append('<p id="address">Your address : '+responseObj.Address+'</p>');
            $('#address').append('<input style="display:block;"id="changeaddress" type="button" value="Edit Address" />');
            $('#address').append('<br><br>');
           
            
            
            $(':button').on('click',function(){
                    //alert('button clicked');
                    alert(this.id);
                    if (this.id == 'changefirstname') {
                        $('#address').append('<p>Your new first name :</p><input type="text" placeholder="Your new first name"></input>');
                        $('#address').append('<p>Type your password :</p><input type="password" placeholder="Please write your password"></input>');
                        $('#address').append('<br><br><input id="confirm" style="display:block;" type="button" value=" Confirm ✓" />');
                        $("#confirm").click(function(){
                            Confirm();
                        });
                       
                    }
                    var c= this.id[6];
                     
                    //Verify(c);
                });
            return true;
    
        }
        else if(xhr.readyState === 4 && xhr.status !== 200)
        {
            alert('error');
          // Note ya Hamada: in Some other APIs you may have to check for each status (400, 401, 403, 404, 500)
            return false;
        }
    };
    
    xhr.send();
    }
    
