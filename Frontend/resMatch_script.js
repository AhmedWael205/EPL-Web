$(document).ready(function(){
    sendJSON();
})

var responseObj ;

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
            responseObj = JSON.parse(this.responseText);

            for (i=0; i < responseObj.length;i++)
            {
                optionText = responseObj[i].HomeTeam+' vs '+responseObj[i].AwayTeam;
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
    var rows = 5;
    var seats = 20;
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
    
    console.log(str2);

    }