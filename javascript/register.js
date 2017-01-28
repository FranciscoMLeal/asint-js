function registerUsername() {

			var username        = document.getElementById("usernameinput").value;
			var errormessagediv = document.getElementById("errormessage");


			console.log("test");

			if (!username) {
				errormessagediv.innerHTML = "No username!";
				fadein(errormessagediv);
			}
			else if(username == "admin" || username == "0"){
				window.location.href = "admin.html";
			}
			else{
				var createUser = new XMLHttpRequest();
				var create_url = "https://fenix-rooms.herokuapp.com/api/create_user";
				createUser.open("POST", create_url,true);
				createUser.setRequestHeader("Content-Type", "application/json");
				createUser.onreadystatechange = function(){
					if(this.readyState == 4){
						if(this.status == 200 || this.status == 409 || this.status == 422){
							window.location.href = "check_in.html";
							fadeout(errormessagediv);
						}else{
							errormessagediv.innerHTML = "Something went wrong with the server or db. Try again later.";
							fadein(errormessagediv);
						}
					}
				}
				//console.log(JSON.stringify({username:username},null,' '));
				createUser.send(JSON.stringify({"username":username},null,' '));
			}
		}

document.onkeydown=function(){
    if(window.event.keyCode=='13'){
        registerUsername();
    }
}
