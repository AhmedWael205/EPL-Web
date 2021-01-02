$(document).ready(function(){
    sendJSON();
})


function sendJSON(){ 
    // Creating a XHR object 
    let xhr = new XMLHttpRequest(); 
    let url = "http://localhost:8080/manager/Matches"; 
    
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
     // return false;
    }
    xhr.setRequestHeader("token", token);
    // DO some logic with These information ya Hamada
    
    xhr.onreadystatechange = function () { 
        if (xhr.readyState === 4 && xhr.status === 200) { 
    
            // Print received data from server            
            var responseObj = JSON.parse(this.responseText);
            //alert(responseObj[1].Username);
            for (i=0; i < responseObj.length;i++)
            {
                var d = new Date(responseObj[i].Date);
                $('#Submitform').append('<label id='+i+'>Match '+i+' , '+responseObj[i].HomeTeam+' vs '+responseObj[i].AwayTeam+'<br> At : '+ d.toUTCString()+' <br> Location: '+responseObj[i].MatchVenue+'</label><br>');
                $('#'+i+'').append('<input style="display:block;"id="button'+i+'" type="button" value="View more" />');
            
            //alert('#button'+i+'');
            
            }
            
            /*
            $(':button').on('click',function(){
                    //alert('button clicked');
                    alert(this.id);
                    if (this.id == 'button1') {
                        alert('Button 1 was clicked');
                    }
                    var c= this.id[6];
                    Verify(responseObj[c].Username);
                    //Verify(c);
                });
                */
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
    
