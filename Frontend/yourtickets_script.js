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
    $('#matchdetails').empty();
    let xhr = new XMLHttpRequest(); 
    let url = "http://localhost:8080/fan/ReservedTickets"; 
    
    // open a connection 
    xhr.open("GET", url, true); 
    
    var token = localStorage.getItem("token");
    if(!token){
    }
    xhr.setRequestHeader("token", token);
   
    xhr.onreadystatechange = function () { 
        if (xhr.readyState === 4 && xhr.status === 200) { 

            var responseObjmatches = JSON.parse(this.responseText);
            

            var std='<td id="md">Teams</td><td id="md">Date</td><td id="md">Seat</td><td></td>'
            $('#matchdetails').append('<tr>'+std+'</tr>');
            
            
            for (i=0; i < responseObjmatches.ReservedTickets.length;i++)
            {
                var d = new Date(responseObjmatches.ReservedTickets[i].Date);
                std = '<td id="md">'+responseObjmatches.ReservedTickets[i].HomeTeam+' vs '+responseObjmatches.ReservedTickets[i].AwayTeam+'</td>';
                std += '<td id="md">'+ d.toUTCString()+'</td>';
                std += '<td id="md">'+String.fromCharCode(65+parseInt(responseObjmatches.ReservedTickets[i].column))+(parseInt(responseObjmatches.ReservedTickets[i].row)+1)+'</td>';
                std += '<td id="md"><button id='+String.fromCharCode(65+parseInt(responseObjmatches.ReservedTickets[i].column))+(parseInt(responseObjmatches.ReservedTickets[i].row)+1)+' value ='+responseObjmatches.ReservedTickets[i]._id+' onclick="cancelticket(this)">Cancel Ticket</button></td>';
                
                
                $('#matchdetails').append('<tr>'+std+'</tr>');
            } 
            return true;
    
        }
        else if(xhr.readyState === 4 && xhr.status !== 200)
        {
            return false;
        }
    };
    
    xhr.send();
}

function cancelticket(objButton){
    
    let xhr = new XMLHttpRequest(); 
    let url = "http://localhost:8080/fan/cancelReservation/"+objButton.value;

    // open a connection 
    xhr.open("DELETE", url, true); 

    var token = localStorage.getItem("token");
    if(!token){
    return false;
    }
    xhr.setRequestHeader("token", token);
    
    xhr.onreadystatechange = function () { 
    if (xhr.readyState === 4 && xhr.status === 200) { 

        var responseObj = JSON.parse(this.responseText);
        alert("You have succesfully cancelled ticket: "+ objButton.id)
        sendJSON();
    
        return true;

    }
    else if(xhr.readyState === 4 && xhr.status !== 200)
    {
        alert('error');
        return false;
    }
    };

    xhr.send();
}