$(document).ready(function(){
    sendJSON();
})

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
            alert("hello");
            //alert(responseObj[0].length);
            alert(responseObj.FirstName);
           
            /*for (i=0; i < responseObj.length;i++)
            {
                var d = new Date(responseObj[i].Date);
                $('#Submitform').append('<label id='+i+'>Match '+i+' , '+responseObj[i].HomeTeam+' vs '+responseObj[i].AwayTeam+'<br> At : '+ d.toUTCString()+' <br> Location: '+responseObj[i].MatchVenue+'</label><br>');
                $('#'+i+'').append('<input style="display:block;"id="button'+i+'" type="button" value="View more" />');
            
            //alert('#button'+i+'');
            
            }*/
            
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
    
