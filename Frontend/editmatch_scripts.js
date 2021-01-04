$(document).ready(function(){
    
    sendJSON();
})
/*function showMatch(Obj){
    var index=$( "#selType option:selected" ).val();  
    var id=Obj[index]._id;
    alert(index);
    var html='<label>Home Team</label ><select class="inputform" id="selType"name="HomeTeam"><option value="Arsenal"selected>Arsenal</option><option value="Fulham">Fulham</option><option value="Sheffield United">Sheffield United</option><option value="Aston Villa">Aston Villa</option><option value="Leeds United">Leeds United</option><option value="Southampton">Southampton</option><option value="Leicester City">Leicester City</option><option value="Tottenham">Tottenham</option><option value="Burnley">Burnley</option><option value="Liverpool">Liverpool</option><option value="West Bromwich">West Bromwich</option><option value="Chelsea">Chelsea</option><option value="Manchester City">Manchester City</option><option value="WestHam United">WestHam United</option<option value="Crystal Palace">Crystal Palace</option><option value="Manchester United">Manchester United</option><option value="Everton">Everton</option><option value="Newcastle United">Newcastle United</option></select><br><br>';
    $("#Submitform").append(html);

}*/
function Edit(id,Obj){
    //alert(Obj.AwayTeam);
    let xhr2 = new XMLHttpRequest(); 
    let url = "http://localhost:8080/manager/editMatch/"+id; 
    xhr2.open("PUT", url, true); 
    
    // open a connection 
    
    
    var token = localStorage.getItem("token");
    xhr2.setRequestHeader("token", token);
    
    xhr2.setRequestHeader("Content-Type", "application/json");
    
    
    
    var data = JSON.stringify({ "HomeTeam": Obj.HomeTeam, "AwayTeam":Obj.AwayTeam,"MatchVenue":Obj.MatchVenue,"Date":Obj.Date,"MainReferee":Obj.MainReferee,"LinemanOne":Obj.LinemanOne,"LinemanTwo":Obj.LinemanTwo});
    xhr2.onreadystatechange = function () { 
        //alert(xhr.readyState);
        //alert(xhr.status);
        if (xhr2.readyState === 4 && xhr2.status === 200) { 
            //lert('here2');
            // Print received data from server            
            var responseObj = JSON.parse(this.responseText);
            //alert(this.responseText)
            window.location.reload();
            return true;

        }
        else if(xhr2.readyState === 4 && xhr2.status !== 200)
        {
            //alert('here3');
            var responseObj = JSON.parse(this.responseText);
            $('#error-msg').addClass("error-text");
            $('#error-msg').text(responseObj.msg);
            $('#error-msg').show();
            return false;
        }
    };
    //alert(data);
    xhr2.send(data);


}
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
            $('#mydiv').before('<select id="selType" name="matches" style="margin: 20px; margin-left: 255px;" >');
            // Print received data from server            
            var responseObj = JSON.parse(this.responseText);
            //alert(responseObj[1].Username);
            for (i=0; i < responseObj.length;i++)
            {
                optionText = responseObj[i].HomeTeam+' vs '+responseObj[i].AwayTeam;
                optionID = i;
                $('#selType').append('<option id="'+optionID+'" value="'+optionID+'">  '+optionText+' </option>');
            
            }
            
            $("#mydiv").before('<button id="confirm"class="btn" style="margin: 20px; margin-left: 280px;">Confirm Selection</button>');

           
            $('#confirm').on('click',function(){
                $("#Submitform").submit(function(event) {
                    // Prevent the form from submitting via the browser.
                    event.preventDefault();
                })
                
                $('#mydiv').empty();
                var index=$( "#selType option:selected" ).val();  
                var id=responseObj[index]._id;
                //alert(responseObj[index].Date);
                var date=responseObj[index].Date.substring(0,19);
                var html='<label>Home Team</label ><select class="inputform" id="selType"name="HomeTeam"><option value="Arsenal">Arsenal</option><option value="Fulham">Fulham</option><option value="Sheffield United">Sheffield United</option><option value="Aston Villa">Aston Villa</option><option value="Leeds United">Leeds United</option><option value="Southampton">Southampton</option><option value="Leicester City">Leicester City</option><option value="Tottenham">Tottenham</option><option value="Burnley">Burnley</option><option value="Liverpool">Liverpool</option><option value="West Bromwich">West Bromwich</option><option value="Chelsea">Chelsea</option><option value="Manchester City">Manchester City</option><option value="WestHam United">WestHam United</option<option value="Crystal Palace">Crystal Palace</option><option value="Manchester United">Manchester United</option><option value="Everton">Everton</option><option value="Newcastle United">Newcastle United</option></select><br><br>';
                html+='<label>Away Team</label ><select class="inputform" id="selType2"name="HomeTeam"><option value="Arsenal">Arsenal</option><option value="Fulham">Fulham</option><option value="Sheffield United">Sheffield United</option><option value="Aston Villa">Aston Villa</option><option value="Leeds United">Leeds United</option><option value="Southampton">Southampton</option><option value="Leicester City">Leicester City</option><option value="Tottenham">Tottenham</option><option value="Burnley">Burnley</option><option value="Liverpool">Liverpool</option><option value="West Bromwich">West Bromwich</option><option value="Chelsea">Chelsea</option><option value="Manchester City">Manchester City</option><option value="WestHam United">WestHam United</option<option value="Crystal Palace">Crystal Palace</option><option value="Manchester United">Manchester United</option><option value="Everton">Everton</option><option value="Newcastle United">Newcastle United</option></select><br><br>';
                html+='<label for="birthdaytime">MatchTime(date and time):</label><input type="datetime-local" id="birthdaytime" name="birthdaytime" value='+date+'><br> <br>';
                html+='<label>Main Referee</label> <input class="inputform" id="selType3"type="text" name="referee" value='+responseObj[index].MainReferee+'> <br> <br>';
                html+='<label>LinesMan1</label> <input class="inputform" id="selType4"type="text" name="line1" value='+responseObj[index].LinemanOne+'> <br> <br>';
                html+='<label>LinesMan2</label> <input class="inputform" id="selType5"type="text" name="line2" value='+responseObj[index].LinemanTwo+'> <br> <br>';
                html+='<button id="confirmedit" class="btn"><i class="fa fa-edit"></i> Confirm Edit</button>';
                $("#mydiv").append(html);
                $("#selType").val(responseObj[index].HomeTeam);
                $("#selType2").val(responseObj[index].AwayTeam);
               // Edit(id);
                $('#confirmedit').on('click',function(){
                        $("#Submitform").submit(function(event) {
                            // Prevent the form from submitting via the browser.
                            event.preventDefault();
                        })
                        responseObj[index].HomeTeam=$('#selType').val(); 
                        responseObj[index].AwayTeam=$('#selType2').val(); 
                        responseObj[index].Date=$('#birthdaytime').val(); 
                        responseObj[index].MainReferee=$('#selType3').val(); 
                        responseObj[index].LinemanOne=$('#selType4').val(); 
                        responseObj[index].LinemanTwo=$('#selType5').val(); 
                        Edit(id,responseObj[index]);

                    });

            });

            
            
            
          
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
    
