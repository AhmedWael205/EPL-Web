function checkInputs(){
    var isValid = "";
    //var d = $()
    $('input').each(function() {
         if($(this).val() == '' && $(this).attr('id')!='address'){
           return isValid = "All fields must be filled ";
         }
     });
    return isValid;
    }
function hasNumber(myString) {
        return /\d/.test(myString);
      }
function hasUpperCase(str) {
        return (/[A-Z]/.test(str));
    }
function validateUsername(){
    var username=$("#username").val();
    var letterNumber = /^[a-zA-Z]+[a-zA-Z0-9]{1,}$/;
    var pattern2= /^.*[0-9]+.*$/;
    if(!letterNumber.test(username))
        {
            
            $('#username').after('<span id="error-msg">invalid username.</span>');
            return false;
        }
    if(!pattern2.test(username))
    {
            $('#username').after('<span id="error-msg">Your username must contain numbers.</span>');
            return false;
    }
    return true;
}
function checkNames(){

    var firstname = $("#firstname").val();
    var lastname = $("#lastname").val();
    var city = $('#city').val();
    var letters=/^[a-zA-Z]+$/;
    if(!letters.test(firstname))
    {
        $("#firstname").after('<span id="error-msg">Your name should contain letters only</span>');
        return false;
    }
    else if(!letters.test(lastname))
    {
        $("#lastname").after('<span id="error-msg">Your name should contain letters only</span>');
        return false;
    }
    else if(!letters.test(city))
    {
        $("#lastname").after('<span id="error-msg">Your city should contain letters only</span>');
        return false;
    }
    return true;
}

function checkEmail(){

    var email = $("#email").val();
    var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    if(!emailReg.test(email))
    {
        $("#email").after('<span id="error-msg">Please enter a valid email</span>');
        return false;
    }
    return true;
}

function validatePassword(){
    var password= $("#password").val();
    if (password.length<8){
        //$('#error-pw').appendTo("A password should be at least 8 characters");
        $('#password').after('<span id="error-msg">A password should be at least 8 characters</span>');
        return false;
    }
    else{
        if(!hasNumber(password) || !hasUpperCase(password))
        {
            $('#password').after('<span id="error-msg">A password should include at least one uppercase character and one numeric digit.</span>');
            return false;
        }
    }
    return true;
}
function checkPassword(){
    var password = $("#password").val();
    var confirmPassword = $("#repassword").val();
    if (password != confirmPassword){
        $("#repassword").after('<span id="error-msg">The two passwords do not match.</span>');
        return false;
    }
    return true;
}



/*function finalize(){
    var name=$("#username").val().toUpperCase();
    console.log($('#selType').val());
    if ($('#selType').val() == "Manager")
    {   
        var newWindow=window.open("","_blank");
        newWindow.document.write("HELLO,"+name+"\nYou are successfuly registered as a Manager");
        return true;
    }
    else{
        var id = prompt("Enter your teaching ID",0);
            if(id!=null && id!='')
            {
               var newWindow=window.open("","_blank");
               newWindow.document.write("Hello,<b> " +name+"</b><br> You are successfully registered as : <b>"+$('#selType').val()+"</b><br>Teaching ID = <b>",+id,"</b>");
            //newWindow.opener.document.write("Hello");
                return true;
            }
   // }
    return false;
}*/
$(document).ready(function(){
   
    $('#submit').click(function () {

       // var url = "http://javarevisited.blogspot.com";
       // $(location).attr('href',url);
        $("span").remove("#error-msg");
        if(checkInputs().length!=0)
        {
            alert(checkInputs());
            return false;
        }
        else{
            if(!checkNames()){
                return false;
            }
            if(!validateUsername()){
                return false;
            }
            if(!validatePassword()){
                return false;
            }
            // if(!checkPassword()){
            //     return false;
            // }
            if(!checkEmail()){
                return false;
            }
            /*if(!finalize())
            {
                return false;
            }*/

            $("#Submitform").submit(function(event) {
                // Prevent the form from submitting via the browser.
                event.preventDefault();
                sendJSON();
                validator.resetForm();
            })
            return true; 
            }
        
    });
})

function sendJSON(){ 
               
    let username = document.querySelector('#username'); 
    let password = document.querySelector('#password'); 
    let email = document.querySelector('#email'); 
    let firstname = document.querySelector('#firstname'); 
    let lastname = document.querySelector('#lastname'); 
    let city = document.querySelector('#city'); 
    let address = document.querySelector('#address'); 
    let gender = document.querySelector('#selGender'); 
    let birth_date = document.querySelector('#age');
    let account_type = document.querySelector('#selType');


       
    // Creating a XHR object 
    let xhr = new XMLHttpRequest(); 
    let url = "http://localhost:8080/accounts/signup"; 

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
            window.location.replace("/Home.html")
            return true;

        }
        else if(xhr.readyState === 4 && xhr.status !== 200)
        {
            var responseObj = JSON.parse(this.responseText)
            message = responseObj.msg;

            if(message = "Username already registered.")
            {
                $('#username').after('<span id="error-msg">Username already exists.</span>');
            }
            
            return false;
        }
    };
    
    var data = JSON.stringify({ "Username": username.value, "Email": email.value, "Password":password.value
    , "Firstname":firstname.value, "Lastname":lastname.value,"Birthdate":birth_date.value,
    "City":city.value, "Address":address.value,"Role":account_type.value,"Gender":gender.value
    });

    xhr.send(data);
} 