
function getAllRooms(){
  var getRooms = new XMLHttpRequest();
  var url = "https://fenix-rooms.herokuapp.com/api/rooms";
  getRooms.open("GET", url, true);

  getRooms.onreadystatechange = function(){
    if(this.readyState == 4){
      if(this.status == 200){
        var i;
        var parsedJson = JSON.parse(getRooms.responseText);
        var div = document.querySelector("#container"),
        radiobutton = document.createElement("input"),
        textRadio = document.createTextNode(""),
        newline,
        button;

        for (i=0; i < parsedJson.length; i++){
          radiobutton = document.createElement("input");
          radiobutton.setAttribute("type","radio");
          radiobutton.setAttribute("name","salas");
          radiobutton.setAttribute("id",parsedJson[i].fenix_id);
          radiobutton.setAttribute("value",parsedJson[i].fenix_id);
          div.appendChild(radiobutton);

          textRadio = document.createTextNode(parsedJson[i].location);
          div.appendChild(textRadio);

          newline= document.createElement("br");
          div.appendChild(newline);
        }
        button = document.createElement("button");
        button.setAttribute("type", "button");
        button.innerHTML = "Check In";
        button.onclick = function(){
          var i=0;
          var search;
          for(i=0; i < parsedJson.length; i++){
            if(document.getElementById(parsedJson[i].fenix_id).checked){
              var user_id = document.cookie.split(';')[1].split('=')[1];
              console.log(user_id);
              if (user_id)
              {
                userChecksIn(user_id,parsedJson[i].fenix_id);
              }else{
                alert("couldnt checkin.");
              }
              break;
            }
          }
        }
        div.appendChild(button);
      }
    }
  }
  getRooms.send();
}

function userChecksIn(user,room_id){
  var CheckIn = new XMLHttpRequest();
  var create_url = "https://fenix-rooms.herokuapp.com/api/check_in";
  CheckIn.open("POST", create_url, true);
  CheckIn.setRequestHeader("Content-type", "application/json");
  CheckIn.onreadystatechange = function(){
    if(this.readyState == 4){
      if(this.status == 200){
        alert("Checkin sucessfully");
      }else{
        alert("Couldn't checkin.")
      }
    }
  }
  CheckIn.send(JSON.stringify({"user_id" : ""+user,"room_id" : ""+room_id},null,' '));
  return false;
}

window.onload = getAllRooms;
