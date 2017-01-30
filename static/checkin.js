
function getAllRooms(){
  var getRooms = new XMLHttpRequest();
  var url = "https://fenix-rooms.herokuapp.com/api/rooms";
  getRooms.open("GET", url, true);
  getRooms.setRequestHeader('Access-Control-Allow-Origin', '*');

  getRooms.onreadystatechange = function(){
    if(this.readyState == 4){
      if(this.status == 200){
        var parsedJson  = JSON.parse(getRooms.responseText);
        var listofrooms = document.getElementById("listofrooms");

        for (var i=0; i < parsedJson.length; i++){

          var radiobutton = document.createElement("input");
          var textRadio   = document.createElement("label");
          var newline     = document.createElement("li");

          radiobutton = document.createElement("input");
          radiobutton.setAttribute("type","radio");
          radiobutton.setAttribute("name","salas");
          radiobutton.setAttribute("id",parsedJson[i].fenix_id);
          radiobutton.setAttribute("class","radio");
          radiobutton.setAttribute("value",parsedJson[i].fenix_id);

          textRadio.setAttribute("for",parsedJson[i].fenix_id);
          var occupationPercentage = (parsedJson[i].fill*1.0) / (parsedJson[i].capacity*1.0) * 100;
          occupationPercentage = Math.round(occupationPercentage * 100) / 100
          if (parsedJson[i].capacity == "0"){
            textRadio.innerHTML = parsedJson[i].location + " (100%)";
          }else{
            textRadio.innerHTML = parsedJson[i].location + " (" + occupationPercentage + "%)";
          }

          newline.appendChild(radiobutton);
          newline.appendChild(textRadio);

          listofrooms.appendChild(newline);
        }

      }else{
        var errormessagediv   = document.getElementById("errormessage");
        errormessagediv.innerHTML = "Connection error!";
        fadein(errormessagediv);
      }
    }
  }
  getRooms.send();
}

checkInRoom = function(){

  var cookieAux = document.cookie.split(';');
  var user_id;

  for(var i = 0; i < cookieAux.length; i++){
    cookieAux[i] = cookieAux[i].replace(/\s+/g, '');
    var cookieBrokenDown = cookieAux[i].split('=');
    if (cookieBrokenDown[0] == "userId"){
      user_id = cookieBrokenDown[1];
    }
  }

  var room_id   = document.querySelector(':checked').value;

  var errormessagediv   = document.getElementById("errormessage");
  var successmessagediv = document.getElementById("successmessage");

  var CheckIn = new XMLHttpRequest();
  var create_url = "https://fenix-rooms.herokuapp.com/api/check_in";

  CheckIn.open("POST", create_url, true);
  CheckIn.setRequestHeader("Content-type", "application/json");
  CheckIn.setRequestHeader('Access-Control-Allow-Origin', '*');

  CheckIn.onreadystatechange = function(){
    if(this.readyState == 4){
      if(this.status == 200){
        document.body.scrollTop = document.documentElement.scrollTop = 0;
        successmessagediv.innerHTML = "Check in Success!";
				document.cookie = "userId=" + user_id;
				document.cookie = "roomId=" + room_id;
				window.location.href = "checkout.html";
        fadein(successmessagediv);
      }else{
        document.body.scrollTop = document.documentElement.scrollTop = 0;
        errormessagediv.innerHTML = "Check in Failed!";
        fadein(errormessagediv);
      }
    }
  }

  CheckIn.send(JSON.stringify({
    "user_id" : ""+user_id,
    "room_id" : ""+room_id
  },null,' '));

  return;
}

function testbutton(){
  if ( document.querySelector(':checked') )
  {
    document.getElementById("reserveroombtn").className = "";
    fadeout(document.getElementById("errormessage"));
    fadeout(document.getElementById("successmessage"));
  }
  else
  {
    document.getElementById("reserveroombtn").className = "btn-disable";
  }
}


window.onload = getAllRooms;
