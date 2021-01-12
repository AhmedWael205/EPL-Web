$(document).ready(function(){
    sendJSON();
})

var responseObjmatches ;
var responsobjseaststatus;
var rows;
var seats;
var matchselcted = -2;
var matchid = -1;
var res;

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
    
    matchselcted = document.getElementById("selType").value;
    $("span").hide("#error-msg");
    $('#seats').empty();
    $('#matchdetails').empty();
    $('#msg').empty();
    var std='<td id="md">Teams</td><td id="md">Date</td><td id="md">Location</td>'
    $('#matchdetails').append('<tr>'+std+'</tr>');
    var d = new Date(responseObjmatches[matchselcted].Date);
    std = '<td id="md">'+responseObjmatches[matchselcted].HomeTeam+' vs '+responseObjmatches[matchselcted].AwayTeam+'</td>';
    std += '<td id="md">'+ d.toUTCString()+'</td>';
    std += '<td id="md">'+responseObjmatches[matchselcted].MatchVenue+'</td>';
    $('#matchdetails').append('<tr>'+std+'</tr>');
    let xhr = new XMLHttpRequest(); 
    let url = "http://localhost:8080/manager/viewSeatStatus/"+responseObjmatches[matchselcted]._id; 
    matchid = responseObjmatches[matchselcted]._id;
    
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
                            str2+='<td><input type="checkbox" disabled="disabled" class="reserved" value="'+i+j+'" checked></td>';
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

    if($("#crdnumber").val().length != 19 || $("#cvv").val().length != 3){
        console.log($("#crdnumber").val().length);
        console.log($("#cvv").val().length)
        $('#error-msg').addClass("error-text");
        $('#error-msg').text("Please enter your credit card number and cvv");
        $('#error-msg').show();
        return;
    }

    $("span").hide("#error-msg");
    var allSeatsSelected = [];
    var allSeatsReserved = [];
    //var msgstr = ' ';

    $('#seats :checked').each(function() {
        allSeatsSelected.push($(this).val());
        });

    $(':disabled').each(function() {
        allSeatsReserved.push($(this).val());
    });

    allSeatsSelected = allSeatsSelected.filter(function(item) {
    return !allSeatsReserved.includes(item); 
    })

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
        //msgstr += String.fromCharCode(rc)+sn+' ';

        // Create a state change callback 
        xhr.onreadystatechange = function () { 
            if (xhr.readyState === 4 && xhr.status === 200) { 
                var responseObj = JSON.parse(this.responseText);
                res = true;
                return true;

            }
            else if(xhr.readyState === 4 && xhr.status !== 200)
            {
                res = false;
                var responseObj = JSON.parse(this.responseText);
                $('#error-msg').addClass("error-text");
                $('#error-msg').text(responseObj.msg);
                $('#error-msg').show();
                return false;
            }
        }
        xhr.send(data);
    }
    updateseats(matchid)
    
}

function updateseats(matchid){

    if(matchid == -1)
    {
        return;
    }

    let xhr = new XMLHttpRequest(); 
    let url = "http://localhost:8080/manager/viewSeatStatus/"+matchid; 
    
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

            
            for (i = 0; i < rows; i++)
            {
                for (j = 0; j < seats; j++)
                {
                    if(responsobjseaststatus.SeatStatus[j][i]==1 && $("input[type=checkbox][value="+i+j+"]").attr("class")=="seats"){
                        $("input[type=checkbox][value="+i+j+"]").removeClass("seats");
                        $("input[type=checkbox][value="+i+j+"]").addClass("reserved");
                        $("input[type=checkbox][value="+i+j+"]").prop("checked", true);
                        $("input[type=checkbox][value="+i+j+"]").prop("disabled", true);
                    }else if(responsobjseaststatus.SeatStatus[j][i]==0 && $("input[type=checkbox][value="+i+j+"]").attr("class")=="reserved"){
                        $("input[type=checkbox][value="+i+j+"]").removeClass("reserved");
                        $("input[type=checkbox][value="+i+j+"]").addClass("seats");
                        $("input[type=checkbox][value="+i+j+"]").prop("checked", false);
                        $("input[type=checkbox][value="+i+j+"]").prop("disabled", false);
                    }
                
                }
            }
            return true;
    
        }
        else if(xhr.readyState === 4 && xhr.status !== 200)
        {
            alert('error update');
          // Note ya Hamada: in Some other APIs you may have to check for each status (400, 401, 403, 404, 500)
            return false;
        }
    };
    
    xhr.send();

}

 setInterval(function() {
     updateseats(matchid)
   }, 2000);
