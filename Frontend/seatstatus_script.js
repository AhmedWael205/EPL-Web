$(document).ready(function(){
    sendJSON();
})

var responseObjmatches ;
var responsobjseaststatus;
var rows;
var seats;
var matchselcted;

function sendJSON(){ 
    // Creating a XHR object 
    let xhr = new XMLHttpRequest(); 
    let url = "http://localhost:8080/manager/Matches"; 
    
    // open a connection 
    xhr.open("GET", url, true); 
    
    var token = localStorage.getItem("token");
    if(!token){
    }
    xhr.setRequestHeader("token", token);
    // DO some logic with These information ya Hamada
    
    xhr.onreadystatechange = function () { 
        if (xhr.readyState === 4 && xhr.status === 200) { 
    
            // Print received data from server            
            responseObjmatches = JSON.parse(this.responseText);

            for (i=0; i < responseObjmatches.length;i++)
            {
                optionText = responseObjmatches[i].HomeTeam+' vs '+responseObjmatches[i].AwayTeam;
                optionID = i;
                $('#selType').append('<option id="'+optionID+'" value="'+optionID+'">  '+optionText+' </option>');
            //alert('#button'+i+'');
            
            } 
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

    function showdetails(){
        $('#matchdetails').empty();
        matchselcted = document.getElementById("selType").value;
        var d = new Date(responseObjmatches[matchselcted].Date);
        $('#matchdetails').append('<tr><td id="md">Teams</td><td id="md">'+responseObjmatches[matchselcted].HomeTeam+' vs '+responseObjmatches[matchselcted].AwayTeam+'</td></tr>');
        $('#matchdetails').append('<tr><td id="md">Date</td><td id="md">'+ d.toUTCString()+'</td></tr>');
        $('#matchdetails').append('<tr><td id="md">Location</td><td id="md">'+responseObjmatches[matchselcted].MatchVenue+'</td></tr>');
        $('#matchdetails').append('<tr><td id="md">Vacant</td><td id="md">'+responseObjmatches[matchselcted].Vacant+'</td></tr>');
        $('#matchdetails').append('<tr><td id="md">Reserved</td><td id="md">'+responseObjmatches[matchselcted].Reserved+'</td></tr>');
    }