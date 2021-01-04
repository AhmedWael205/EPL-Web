$(document).ready(function(){
    sendJSON();
})
function Confirm(Object,pass){ 
    // Creating a XHR object 
   
    let xhr = new XMLHttpRequest(); 
    let url = "http://localhost:8080/fan/editData"; 
    
    // open a connection 
    xhr.open("PUT", url, true); 
    
    var token = localStorage.getItem("token");

    xhr.setRequestHeader("token", token);
    
    alert(Object.Firstname);
    alert(Object.Gender);
    alert('here1');
    alert(pass);
    var data = JSON.stringify({ "Firstname":Object.Firstname, "Lastname":Object.Lastname,"Gender":Object.Gender
    ,"Birthdate":Object.Birthdate, "Password":pass, "NewPassword":null, 
    "City":Object.City, "Address":Object.Address
    });
    xhr.send(data);

    xhr.onreadystatechange = function () { 
        if (xhr.readyState === 4 && xhr.status === 200) { 
            alert('here2');
            // Print received data from server            
            var responseObj = JSON.parse(this.responseText);
            alert('Your data updated successfully');
            return true;
    
        }
        else if(xhr.readyState === 4 && xhr.status !== 200)
        {
            //alert('errorrr');
            var responseObj = JSON.stringify(this.responseText);
            alert(responseObj);
          // Note ya Hamada: in Some other APIs you may have to check for each status (400, 401, 403, 404, 500)
            return false;
        }
    };
  
    
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
            $('#Submitform').append('<p>Change password:<input style="display:block;"id="changepw" type="button" value="Edit Password" />');

            $('#Submitform').append('<p id="firstname">Your First name : '+responseObj.Firstname+'</p><br>');
            $('#firstname').append('<input style="display:block;"id="changefirstname" type="button" value="Edit First Name" />');

            $('#firstname').append('<p id="lastname">Your Last name : '+responseObj.Lastname+'</p><br>');
            $('#lastname').append('<input style="display:block;"id="changelastname" type="button" value="Edit Last Name" />');

            $('#lastname').append('<p id="birthdate">Your Birthdate : '+d.toDateString()+'</p>');
            $('#birthdate').append('<input style="display:block;"id="changebd" type="button" value="Edit Birthdate" />');

            $('#birthdate').append('<p id="city">Your city : '+responseObj.City+'</p>');
            $('#city').append('<input style="display:block;"id="changecity" type="button" value="Edit City" />');

            $('#city').append('<p id="gender">Your gender : '+responseObj.Gender+'</p>');
            $('#gender').append('<input style="display:block;"id="changegender" type="button" value="Edit Gender" />');

            

            $('#gender').append('<p id="address">Your address : '+responseObj.Address+'</p>');
            $('#address').append('<input style="display:block;"id="changeaddress" type="button" value="Edit Address" />');
            $('#address').append('<br><br>');

           
           
            
            
            $(':button').on('click',function(){
                    //alert('button clicked');
                    alert(this.id);
                    if (this.id == 'changefirstname') {
                        $('#address').append('<p>Your new first name :</p><input id="newFN" type="text" placeholder="Your new first name"></input>');
                        $('#address').append('<p>Type your password :</p><input id="pw" type="password" placeholder="Please write your password"></input>');
                        $('#address').append('<br><br><input id="confirm" style="display:block;" type="button" value=" Confirm ✓" />');
                        $("#confirm").click(function(){
                            //alert(responseObj.Firstname);
                            responseObj.Firstname= document.querySelector('#newFN').value; 
                            var pw=document.querySelector('#pw').value; 
                            //alert(pw);
                            Confirm(responseObj,pw);
                        });
                       
                    }
                    else if (this.id == 'changelastname') {
                        $('#address').append('<p>Your new last name :</p><input id="newLN" type="text" placeholder="Your new last name"></input>');
                        $('#address').append('<p>Type your password :</p><input id="pw" type="password" placeholder="Please write your password"></input>');
                        $('#address').append('<br><br><input id="confirm" style="display:block;" type="button" value=" Confirm ✓" />');
                        $("#confirm").click(function(){
                            //alert(responseObj.Firstname);
                            responseObj.Lastname= document.querySelector('#newLN').value; 
                            var pw=document.querySelector('#pw').value; 
                            //alert(pw);
                            Confirm(responseObj,pw);
                        });
                    }
                    else if (this.id == 'changebd') {
                        $('#address').append('<p>Your new Birth date :</p><input id="newBD" type="date">');
                        $('#address').append('<p>Type your password :</p><input id="pw" type="password" placeholder="Please write your password"></input>');
                        $('#address').append('<br><br><input id="confirm" style="display:block;" type="button" value=" Confirm ✓" />');
                        $("#confirm").click(function(){
                            //alert(responseObj.Firstname);
                            responseObj.Birthdate= document.querySelector('#newBD').value; 
                            var pw=document.querySelector('#pw').value; 
                            //alert(pw);
                            Confirm(responseObj,pw);
                        });
                    }
                    else if (this.id == 'changecity') {
                        $('#address').append('<p>Your new City :</p><input id="newCITY" type="text" placeholder="Your new city"></input>');
                        $('#address').append('<p>Type your password :</p><input id="pw" type="password" placeholder="Please write your password"></input>');
                        $('#address').append('<br><br><input id="confirm" style="display:block;" type="button" value=" Confirm ✓" />');
                        $("#confirm").click(function(){
                            //alert(responseObj.Firstname);
                            responseObj.City= document.querySelector('#newCITY').value; 
                            var pw=document.querySelector('#pw').value; 
                            //alert(pw);
                            Confirm(responseObj,pw);
                        });
                    }
                    else if (this.id == 'changeaddress') {
                        $('#address').append('<p>Your new address  :</p><input id="newADD" type="text" placeholder="Your new address"></input>');
                        $('#address').append('<p>Type your password :</p><input id="pw" type="password" placeholder="Please write your password"></input>');
                        $('#address').append('<br><br><input id="confirm" style="display:block;" type="button" value=" Confirm ✓" />');
                        $("#confirm").click(function(){
                            //alert(responseObj.Firstname);
                            responseObj.Address= document.querySelector('#newADD').value; 
                            var pw=document.querySelector('#pw').value; 
                            //alert(pw);
                            Confirm(responseObj,pw);
                        });
                    }
                    else if (this.id == 'changegender') {
                        $('#address').append('<p>Your new gender:</p><label>Gender</label> <select class="inputform" id="newGender"name="Gender"><option value="Male"selected>Male</option><option value="Female">Female</option></select>');
                        $('#address').append('<p>Type your password :</p><input id="pw" type="password" placeholder="Please write your password"></input>');
                        $('#address').append('<br><br><input id="confirm" style="display:block;" type="button" value=" Confirm ✓" />');
                        $("#confirm").click(function(){
                            //alert(responseObj.Firstname);
                            responseObj.Gender= document.querySelector('#newGender').value; 
                            var pw=document.querySelector('#pw').value; 
                            //alert(pw);
                            Confirm(responseObj,pw);
                        });
                    }
                    else if (this.id == 'changepw') {
                        $('#address').append('<p>Type your new password :</p><input id="newPW" type="password" placeholder="Please write your new password"></input>');
                        $('#address').append('<p>Type your password :</p><input id="pw" type="password" placeholder="Please write your password"></input>');
                        $('#address').append('<br><br><input id="confirm" style="display:block;" type="button" value=" Confirm ✓" />');
                        $("#confirm").click(function(){
                            //alert(responseObj.Firstname);
                            responseObj.Address= document.querySelector('#newPW').value; 
                            var pw=document.querySelector('#pw').value; 
                            //alert(pw);
                            Confirm(responseObj,pw);
                        });
                    }
                    
                    

                    //var c= this.id[6];
                    //Verify(c);
                });
            return true;
    
        }
        else if(xhr.readyState === 4 && xhr.status !== 200)
        {
            //alert('error');
          // Note ya Hamada: in Some other APIs you may have to check for each status (400, 401, 403, 404, 500)
            return false;
        }
    };
    
    xhr.send();
    }
    
