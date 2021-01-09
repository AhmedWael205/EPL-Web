// Next/previous controls
$(document).ready(function(){
   
    sendJSON()
    var slideIndex = 0;
    showSlides();

  function showSlides() {
    var i;
    var slides = document.getElementsByClassName("mySlides");
    for (i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";
    }
    slideIndex++;
    if (slideIndex > slides.length) {slideIndex = 1}
    slides[slideIndex-1].style.display = "block";
    setTimeout(showSlides, 2000); // Change image every 2 seconds
  }
})

function sendJSON(){ 


  // Creating a XHR object 
  let xhr = new XMLHttpRequest(); 
  let url = "http://localhost:8080/home"; 

  // open a connection 
  xhr.open("GET", url, true); 
 
  var token = localStorage.getItem("token");
  if(!token){
    // token == null then GUEST
    // Do some logic ya Hamada
    // Bos dh el mafrood zy el 7ata bta3t 
    // var username = "Guest";
    // bs ka2nek bt3mal el check dh 3ndk eno null
    // el ta7t dh lama ana fel server btcheck
    // el mafrood yab2o same
    return false;
  }
  xhr.setRequestHeader("token", token);
  // DO some logic with These information ya Hamada

  xhr.onreadystatechange = function () { 
      if (xhr.readyState === 4 && xhr.status === 200) { 

          // Print received data from server            
          var responseObj = JSON.parse(this.responseText)
          var username = responseObj.Username;
          var Role = responseObj.Role;
          if(Role == "Admin")
          {
            // Show verify , remove users
            $('#logout').show();
            $('#login').hide();
            $('#signup').hide();
            $('#home').before('<a id="hello"style="background-color:black;"> Hello,'+username+'</a>');
            $('#home').after('<a class="btn" id="adduser" href="/approveusers.html"> Approve users <i class="fa fa-check"></a>'); 
            $('#home').after('<a class="btn" id="removeuser" href="/removeusers.html"> Remove users <i class="fa fa-remove"></a>');
            $('#viewmatch').hide();
            //$('#addmatch').after('<a id="editmatch" href="/editmatch.html"> Edit matches </a>');            // Show Admin features
            $('#logout').on('click',function(){
              localStorage.removeItem("token");
              $('#logout').hide();
              $('#login').show();
              $('#signup').show();
              $('#hello').hide();
              window.location.replace("/Home.html");
            });
          }
          else if(Role == "Manager")
          {
            $('#logout').show();
            $('#login').hide();
            $('#signup').hide();
            $('#home').before('<a id="hello"style="background-color:black;"> Hello,'+username+'</a>');
            $('#home').after('<a class="btn" id="addmatch" href="/creatematch.html"> Add a new match  <i class="fa fa-plus"></a>');
            $('#addmatch').after('<a class="btn" id="editmatch" href="/editmatch.html"> Edit matches <i class="fa fa-edit"></a>');
            $('#editmatch').after('<a class="btn" id="addstadium" href="/addstad.html"> Add Stadium <i class="fa fa-edit"></a>');
            $('#addstadium').after('<a class="btn" id="seatstatus" href="/seatstatus.html"> View Seat Status <i class="fa fa-edit"></a>');
           
            // Show Manager features
            $('#logout').on('click',function(){
              localStorage.removeItem("token");
              $('#logout').hide();
              $('#login').show();
              $('#signup').show();
              $('#hello').hide();
              window.location.replace("/Home.html");
            });

          }
          else if(Role == "Fan")
          {
            $('#logout').show();
            $('#login').hide();
            $('#signup').hide();
            $('#home').before('<a style="background-color:black;"> Hello,'+username+'</a>');
            $('#home').after('<a class="btn" id="editdata" href="/editdata.html"> Edit my profile <i class="fa fa-edit"></i></a>');
            $('#editdata').after('<a class="btn" id="resmatch" href="/resMatch.html"> Reserve Tickets <i class="fa fa-edit"></a>');
            $('#resmatch').after('<a class="btn" id="yourtickets" href="/yourtickets.html"> Your Tickets <i class="fa fa-edit"></a>');
            //$('#addmatch').after('<a id="editmatch" href="/editmatch.html"> Edit matches </a>');
            $('#logout').on('click',function(){
              localStorage.removeItem("token");
              $('#logout').hide();
              $('#login').show();
              $('#signup').show();
              $('#hello').hide();
              window.location.replace("/Home.html");
            });

          }

          else
          {
           
            //$('#navbar2').show();
            //$('#page1').page();
            // Show Fan Features
          }
          return true;

      }
      else if(xhr.readyState === 4 && xhr.status !== 200)
      {
        // Note ya Hamada: in Some other APIs you may have to check for each status (400, 401, 403, 404, 500)
          var username = "Guest";
          return false;
      }
  };

  xhr.send();
}


// Hamada Lw howa user a3melo button logout we a3mel uncomment le dh


