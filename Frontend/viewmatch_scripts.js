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
    
    xhr.onreadystatechange = async function () { 
        if (xhr.readyState === 4 && xhr.status === 200) { 
    
            // Print received data from server            
            var responseObj = JSON.parse(this.responseText);
            //alert(responseObj[1].Username); 
            for (i=0; i < responseObj.length;i++)
            {
                var d = new Date(responseObj[i].Date);
                $('#Submitform').append('<label id='+i+'>Match '+i+' , '+responseObj[i].HomeTeam+' vs '+responseObj[i].AwayTeam+'<br> At : '+ d.toUTCString()+' <br> Location: '+responseObj[i].MatchVenue+'</label><br>');
                $('#Submitform').append('<table id="seats" class="seats'+i+'" ></table> <hr>');
                await buildstad(responseObj[i]._id,i)
                //$('#'+i+'').append('<input style="display:block;"id="button'+i+'" type="button" value="View more" />');
            
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
    
    async function buildstad(id,i){

        let xhr = new XMLHttpRequest(); 
        let url = "http://localhost:8080/manager/viewSeatStatus/"+id; 
        
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
                var c = '.seats'+i; 
                responsobjseaststatus = JSON.parse(this.responseText);
                seats = parseInt( responsobjseaststatus.SeatStatus.length);
                rows = parseInt( responsobjseaststatus.SeatStatus[0].length);
                //alert("row: "+rows+" seats: "+seats);
                $(c).append('<tr>'
                                +'<td colspan="'+(seats+1)+'"><div class="stadium">FIELD</div></td>'
                                +'<td width="10px"></td>'
                                +'<td rowspan="'+rows+'">'
                                +'<div class="smallBox redBox">Reserved Seat</div><br/>'
                                +'<div class="smallBox emptyBox">Empty Seat</div><br/>'
                                +'</td>'
                                +'</tr>');

                var str1 = '<td></td>';
                for (i = 1; i <= seats; i++)
                {
                    str1 += '<td>'+i+'</td>';
                }
                
                $(c).append('<tr>'+str1+'</tr>');

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
                                str2+='<td><input type="checkbox" disabled="disabled" class="seats" value="'+i+j+'"></td>';
                            }
                        }
                    }
                    $(c).append('<tr>'+str2+'</tr>');
                }

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