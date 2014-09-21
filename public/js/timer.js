var maxTime = 200;
var time = maxTime;
var socket=io();

setInterval(function () {
	time--;
	if (time == 0) { reset(); }
	$("#timer").text((time / 10).toFixed(1) + "s");
}, 100);

function reset() {
	time = maxTime;
	$("#word-list").empty();
	socket.emit('update word');
	socket.emit('time up');
}