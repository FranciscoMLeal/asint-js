var listOfSelects = new Array();

function getInitialRooms(){

    var getRooms = new XMLHttpRequest();
    var url = "https://fenix-rooms.herokuapp.com/api/spaces";
    getRooms.open("GET", url, true);
    getRooms.setRequestHeader('Access-Control-Allow-Origin', '*');
    getRooms.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200){
            var parsedJson = JSON.parse(getRooms.responseText);
            var select = document.getElementById("initialselector");
            listOfSelects.push(select);
            var index = "" + listOfSelects.indexOf(select);
            select.setAttribute("id",index);
            select.onchange = function(){ addSelectLayer(this); }
            for (var i=0; i < parsedJson.length; i++){
                select.options.add( new Option(parsedJson[i].name,parsedJson[i].id));
            }
        } else if (this.readyState == 4) {
            var errormessagediv = document.getElementById("errormessage");
            errormessagediv.innerHTML = "Connection to the API failed!";
            fadein(errormessagediv);
        }
    }
    getRooms.send();
}

function addSelectLayer(selectObject){
    var getSpace = new XMLHttpRequest();
    var space_url = "https://fenix-rooms.herokuapp.com/api/id/" + selectObject.value;
    getSpace.open("GET", space_url,true);
    getSpace.setRequestHeader('Access-Control-Allow-Origin', '*');
    var errormessagediv   = document.getElementById("errormessage");
    var successmessagediv = document.getElementById("successmessage");
    fadeout(errormessagediv);
    fadeout(successmessagediv);

    if ( listOfSelects.indexOf(selectObject) != listOfSelects.length -1){
        for( var i = listOfSelects.length-1; i > listOfSelects.indexOf(selectObject); i--){
          listOfSelects[i].parentNode.parentNode.removeChild(listOfSelects[i].parentNode)
          listOfSelects.pop();
        }
    }

    getSpace.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200){
            var parsedSpacesJson = JSON.parse(getSpace.responseText);
            var button = document.getElementById("reserveroombtn");

            if(parsedSpacesJson.hasOwnProperty('capacity')){
                button.onclick = function(){
                    adminPostRoom(this, parsedSpacesJson, selectObject.value);
                }
                button.className = "";
            }else{
                button.className = "btn-disable";
                var div               = document.getElementById("selectorscontainer");
                var selectorcontainer = document.createElement("div");
                var select            = document.createElement("select");
                selectorcontainer.className = "selectorcontainer";
                listOfSelects.push(select);
                var index = "" + listOfSelects.indexOf(select);
                select.setAttribute("id",index);
                select.onchange = function(){addSelectLayer(this);}
                select.options.add( new Option("Select one", " "));

                for (var i=0; i < parsedSpacesJson.containedSpaces.length; i++){
                    select.options.add( new Option(
                        parsedSpacesJson.containedSpaces[i].name,
                        parsedSpacesJson.containedSpaces[i].id
                    ));
                }

                selectorcontainer.appendChild(select);
                console.log(selectorcontainer)
                div.appendChild(selectorcontainer);
          }
        } else if (this.readyState == 4) {
            errormessagediv.innerHTML = "Connection error to the API!";
            fadein(errormessagediv);
        }
    }
    getSpace.send();
}

function adminPostRoom(selectObject,space,identifier){

  var createRoom = new XMLHttpRequest();
  var create_url = "https://fenix-rooms.herokuapp.com/api/create_room";
  createRoom.open("POST", create_url, true);
	createRoom.setRequestHeader("Content-type", "application/json");
  createRoom.setRequestHeader('Access-Control-Allow-Origin', '*');
  createRoom.onreadystatechange = function(){
    if(this.readyState == 4){
      if(this.status == 200){
        var successmessagediv = document.getElementById("successmessage");
        successmessagediv.innerHTML = "Room reserved sucessfully!";
        fadein(successmessagediv);
      }else{
        var errormessagediv = document.getElementById("errormessage");
        errormessagediv.innerHTML = "It was not possible to reserve this room!";
        fadein(errormessagediv);
      }
    }
  }
  createRoom.send(JSON.stringify({
          "location" : space.name,
          "capacity" : "" + space.capacity.normal,
          "fenix_id" : identifier,
          "user_id"  : "0"
        },null,' '));
}

window.onload = getInitialRooms;
