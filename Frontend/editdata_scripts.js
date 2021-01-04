$(document).ready(function(){
    $("span").remove("#error-msg");
    sendJSON();
})
function Confirm(Object,pass,newpw){
    if(newpw==""){
        newpw=null;
    } 
    let xhr2 = new XMLHttpRequest(); 
    let url = "http://localhost:8080/fan/editData"; 
    xhr2.open("PUT", url, true); 
    
    // open a connection 
    
    
    var token = localStorage.getItem("token");
    xhr2.setRequestHeader("token", token);
    
    xhr2.setRequestHeader("Content-Type", "application/json");
    
    
    
    var data = JSON.stringify({ "Firstname":Object.Firstname, "Lastname":Object.Lastname,"Gender":Object.Gender
    ,"Birthdate":Object.Birthdate, "Password":pass,"NewPassword":newpw, 
    "City":Object.City, "Address":Object.Address
    });

    xhr2.onreadystatechange = function () { 
        //alert(xhr.readyState);
        //alert(xhr.status);
        if (xhr2.readyState === 4 && xhr2.status === 200) { 
            //lert('here2');
            // Print received data from server            
            var responseObj = JSON.parse(this.responseText);
            //alert(this.responseText)
            window.location.reload();
            return true;

        }
        else if(xhr2.readyState === 4 && xhr2.status !== 200)
        {
            //alert('here3');
            var responseObj = JSON.parse(this.responseText);
            $('#error-msg').addClass("error-text");
            $('#error-msg').text(responseObj.msg);
            $('#error-msg').show();
            return false;
        }
    };
    //alert(data);
    xhr2.send(data);
}
    


function sendJSON(){ 
    // Creating a XHR object 
    let xhr = new XMLHttpRequest(); 
    let url = "http://localhost:8080/fan/data"; 
    
    // open a connection 
    xhr.open("GET", url, true); 
    
    var token = localStorage.getItem("token");

    xhr.setRequestHeader("token", token);
    xhr.setRequestHeader("Content-Type", "application/json");
    // DO some logic with These information ya Hamada
    
    xhr.onreadystatechange = function () { 
        if (xhr.readyState === 4 && xhr.status === 200) { 
    
            // Print received data from server            
            var responseObj = JSON.parse(this.responseText);
            var date= responseObj.Birthdate.substring(0,10);
            
            
            
          
            var html='<label>First Name :</label> <input class="inputform" id="firstname"type="text" name="Firstname" value='+responseObj.Firstname+'> <br> <br>';
            html+='<label>Last Name :</label> <input class="inputform" id="lastname"type="text" name="Lastname" value='+responseObj.Lastname+'> <br><br>';
            html+='<label>Password :</label> <input class="inputform" id="password" type="password" name="Password" placeholder="write a new password here" ><br> <br>';
            html+='<label>Birthdate:</label><input class="inputform" id="age" type="date" name="Birthdate" value='+date+'><br><br>';
            html+='<label>Gender:</label> <select id="selGender" class="inputform"  name="Gender" ><option value="Male">Male</option><option value="Female">Female</option></select><br><br>';
            
    
            html+='<label>City:</label> <input class="inputform" id="city"type="text" name="City" value='+responseObj.City+'> <br> <br>';
            html+='<label>Address:</label> <input class="inputform" id="address"type="text" name="Address" value='+responseObj.Address+'> <br> <br>'
            
            html+='<label>*Verify Password :</label> <input class="inputform" id="verPW"type="password" placeholder="write your password here" ><br> <br>';
            
            
            html+='<span hidden style="float:left" class="error-message" id="error-msg" ></span><br><br><br>';
            html+='<button class="btn"><i class="fa fa-edit"></i> Confirm Edit</button>';
            
            $('#Submitform').append(html);
            
            if(responseObj.Gender=='Male'){
            $("#selGender").val("Male");
            }
            else{
            $("#selGender").val("Female");}
           
           
            
            
            $(':button').on('click',function(e){
                    $("#Submitform").submit(function(event) {
                        // Prevent the form from submitting via the browser.
                        event.preventDefault();
                    })
                    responseObj.Firstname = $('#firstname').val(); 
                    responseObj.Lastname = $('#lastname').val(); 
                    responseObj.City = $('#city').val(); 
                    responseObj.Address = $('#address').val(); 
                    responseObj.Gender = $('#selGender').val(); 
                    responseObj.Birthdate =$('#age').val();
                    
                    var newpw=$('#password').val();
                    var pw = $('#verPW').val();
                    //var newpw=$('password').val();
                    Confirm(responseObj,pw,newpw); 
                    
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
    
