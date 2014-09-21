var time = 0;
var socket=io();

setInterval(function () {
	if (time == 0) { 
		console.log("client time is 0");
		socket.emit("sync timer");
	}
	else{		
		time--;
		$("#timer").text((time / 10).toFixed(1) + "s");
	}
}, 100);

socket.on("receive sync timer", function(serverTime){
	console.log("set time = serverTime");
	time = serverTime;
});