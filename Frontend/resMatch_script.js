$(document).ready(function(){
    sendJSON();
})

var responseObjmatches ;
var responsobjseaststatus;
var rows;
var seats;

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
    var matchselcted = document.getElementById("selType").value;
    
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
                for (j = 0; j <= seats; j++)
                {
                    if(j==0){
                        str2+='<td>&#'+ch+'</td>'
                        ch++;
                    }
                    else{
                        if(responsobjseaststatus.SeatStatus[i][j]==1){
                            str2+='<td><input type="checkbox" style="background:red;" disabled="disabled" class="reserved" value="'+ch+j+'" checked></td>';
                        }else{
                            str2+='<td><input type="checkbox" class="seats" value="'+ch+j+'"></td>';
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
    /*
    alert("rows= "+rows+" seats= "+seats);
    $('#seats').append('<tr>'
                    +'<td colspan="'+seats+1+'"><div class="stadium">STADIUM</div></td>'
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
    console.log(str1);
    $('#seats').append('<tr>'+str1+'</tr>');
    var ch = 65;
    
    for (i = 0; i < rows; i++)
    {
        var str2 = "";
        for (j = 0; j <= seats; j++)
        {
            if(j==0){
                str2+='<td>&#'+ch+'</td>'
                ch++;
            }
            else{
                str2+='<td><input type="checkbox" class="seats" value="'+ch+j+'"></td>';
            
            }
        }
        $('#seats').append('<tr>'+str2+'</tr>');

    }
    */
    }

    function resTickets(){
        var allSeatsSelected = [];
        var allSeatsReserved = [];
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
    }