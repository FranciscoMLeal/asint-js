function showAllUsersOnRoom(){
  var cookieAux = document.cookie.split(';');
  var userId;
  var roomId;
  for(var i = 0; i < cookieAux.length; i++){
    cookieAux[i] = cookieAux[i].replace(/\s+/g, '');
    var cookieBrokenDown = cookieAux[i].split('=');
    if (cookieBrokenDown[0] == "userId"){
      userId = cookieBrokenDown[1];
    }
    if (cookieBrokenDown[0] == "roomId"){
      roomId = cookieBrokenDown[1];
    }
  }

  if (!userId || !roomId){
    alert("You haven't checked in");
    window.location.href = "checkin.html";
  }

  var getAllUsers = new XMLHttpRequest();
  var getAllUsers_url = "https://fenix-rooms.herokuapp.com/api/check_in/" + roomId;

  getAllUsers.open("GET", getAllUsers_url, true);
  getAllUsers.setRequestHeader("Content-type", "application/json");

  getAllUsers.onreadystatechange = function(){
      if(this.readyState == 4){
          if(this.status == 200){
            var parsedJson = JSON.parse(getAllUsers.responseText);
            var students = document.getElementById("listOfStudents");
            var usernames = [];
            var allNames = "";
            for (var i=1; i < parsedJson["users"].length; i++){
                usernames.push(parsedJson["users"][i]);
                allNames += parsedJson["users"][i] + ' ';
            }
            console.log(usernames);
            students.innerHTML = allNames;
          }else{
          }
      }
  }

  getAllUsers.send();
}

function checkoutUser(){
  var cookieAux = document.cookie.split(';');
  var userId;
  var roomId;
  for(var i = 0; i < cookieAux.length; i++){
    cookieAux[i] = cookieAux[i].replace(/\s+/g, '');
    var cookieBrokenDown = cookieAux[i].split('=');
    if (cookieBrokenDown[0] == "userId"){
      userId = cookieBrokenDown[1];
    }
    if (cookieBrokenDown[0] == "roomId"){
      roomId = cookieBrokenDown[1];
    }
  }

  if (!userId || !roomId){
    alert("You haven't checked in");
    window.location.href = "checkin.html";
  }

  var CheckOut = new XMLHttpRequest();
  var checkout_url = "https://fenix-rooms.herokuapp.com/api/check_out";

  CheckOut.open("DELETE", checkout_url, true);
  CheckOut.setRequestHeader("Content-type", "application/json");

  CheckOut.onreadystatechange = function(){
      if(this.readyState == 4){
          if(this.status == 200){
              document.cookie = "userId=" + userId;
              document.cookie = "roomId=" + roomId;
          }else{
          }
      }
  }

  CheckOut.send(JSON.stringify({
      "user_id" : ""+userId,
      "room_id" : ""+roomId
  },null,' '));

  return;
}

window.onload = showAllUsersOnRoom;
