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
    

function buildstad(){

    $('#seats').empty();
    $('#matchdetails').empty();
    $('#msg').empty();
    matchselcted = document.getElementById("selType").value;
    var std='<td id="md">Teams</td><td id="md">Date</td><td id="md">Location</td>'
    $('#matchdetails').append('<tr>'+std+'</tr>');
    var d = new Date(responseObjmatches[matchselcted].Date);
    std = '<td id="md">'+responseObjmatches[matchselcted].HomeTeam+' vs '+responseObjmatches[matchselcted].AwayTeam+'</td>';
    std += '<td id="md">'+ d.toUTCString()+'</td>';
    std += '<td id="md">'+responseObjmatches[matchselcted].MatchVenue+'</td>';
    $('#matchdetails').append('<tr>'+std+'</tr>');
    let xhr = new XMLHttpRequest(); 
    let url = "http://localhost:8080/manager/viewSeatStatus/"+responseObjmatches[matchselcted]._id; 
    
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
            responsobjseaststatus = JSON.parse(this.responseText);
            seats = responsobjseaststatus.SeatStatus.length;
            rows = responsobjseaststatus.SeatStatus[0].length;

            $('#seats').append('<tr>'
                            +'<td colspan="'+seats+1+'"><div class="stadium">FIELD</div></td>'
                            +'<td width="10px"></td>'
                            +'<td rowspan="'+rows+'">'
                            +'<div class="smallBox greenBox">Selected Seat</div> <br/>'
                            +'<div class="smallBox redBox">Reserved Seat</div><br/>'
                            +'<div class="smallBox emptyBox">Empty Seat</div><br/>'
                            +'</td>'
                            +'</tr>');

            var str1 = '<td></td>';
            for (i = 1; i <= seats; i++)
            {
                str1 += '<td>'+i+'</td>';
            }
            
            $('#seats').append('<tr>'+str1+'</tr>');
            var ch = 65;
            
            for (i = 0; i < rows; i++)
            {
                var str2 = "";
                for (j = -1; j < seats; j++)
                {
                    if(j==-1){
                        str2+='<td>&#'+ch+'</td>'
                        ch++;
                    }
                    else{
                        if(responsobjseaststatus.SeatStatus[j][i]==1){
                            str2+='<td><input type="checkbox" style="background:red;" disabled="disabled" class="reserved" value="'+i+j+'" checked></td>';
                        }else{
                            str2+='<td><input type="checkbox" class="seats" value="'+i+j+'"></td>';
                        }
                    }
                }
                $('#seats').append('<tr>'+str2+'</tr>');
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

function resTickets(){
    var allSeatsSelected = [];
    var allSeatsReserved = [];
    var msgstr = ' ';
    $('#seats :checked').each(function() {
        allSeatsSelected.push($(this).val());
        });

    $(':disabled').each(function() {
        allSeatsReserved.push($(this).val());
    });

    allSeatsSelected = allSeatsSelected.filter(function(item) {
    return !allSeatsReserved.includes(item); 
    })
    alert(allSeatsSelected);

    for (i=0; i < allSeatsSelected.length;i++){
        // Creating a XHR object 
        let xhr = new XMLHttpRequest(); 
        let url = "http://localhost:8080/fan/reserveMatch"; 

        // open a connection 
        xhr.open("PUT", url, true); 

        // Set the request header i.e. which type of content you are sending 
        var token = localStorage.getItem("token");
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.setRequestHeader("token", token);
        var rc = 65 + parseInt(allSeatsSelected[i][0]);
        var sn = parseInt(allSeatsSelected[i][1]) + 1;
        var data = JSON.stringify({ "id": responseObjmatches[matchselcted]._id, "row":allSeatsSelected[i][1],"column":allSeatsSelected[i][0]});
        msgstr += String.fromCharCode(rc)+sn+' ';

        // Create a state change callback 
        xhr.onreadystatechange = function () { 
            //alert(xhr.readyState);
            //alert(xhr.status);
            if (xhr.readyState === 4 && xhr.status === 200) { 
                // Print received data from server            
                var responseObj = JSON.parse(this.responseText);
                //alert(this.responseText)
                window.location.reload();
                
                return true;

            }
            else if(xhr.readyState === 4 && xhr.status !== 200)
            {
                var responseObj = JSON.parse(this.responseText);
                $('#msg').text(responseObj.msg);
                return false;
            }
        };

        xhr.send(data);
        alert('You have succesfully booked tickets:'+msgstr);  
    }
}