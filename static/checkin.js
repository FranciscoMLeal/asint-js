
function getAllRooms(){
    var getRooms = new XMLHttpRequest();
    var url = "https://fenix-rooms.herokuapp.com/api/rooms";
    getRooms.open("GET", url, true);

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
                textRadio.innerHTML = parsedJson[i].location;

                newline.appendChild(radiobutton);
                newline.appendChild(textRadio);

                listofrooms.appendChild(newline);
            }


            var button = document.getElementById("reserveroombtn");
            button.className = "";

            }
        }
  }
  getRooms.send();
}


checkInRoom = function(){

    var cookieAux = document.cookie.split(';');
    var user_id   = cookieAux[1];
    var room_id   = document.querySelector(':checked').value;

    var errormessagediv   = document.getElementById("errormessage");
    var successmessagediv = document.getElementById("successmessage");

    var CheckIn = new XMLHttpRequest();
    var create_url = "https://fenix-rooms.herokuapp.com/api/check_in";

    CheckIn.open("POST", create_url, true);
    CheckIn.setRequestHeader("Content-type", "application/json");

    CheckIn.onreadystatechange = function(){
        if(this.readyState == 4){
            if(this.status == 200){
                document.body.scrollTop = document.documentElement.scrollTop = 0;
                successmessagediv.innerHTML = "Check in Success!";
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

window.onload = getAllRooms;
