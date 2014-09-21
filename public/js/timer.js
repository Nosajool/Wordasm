var maxTime = 400;
var time = maxTime;

setInterval(function () {
	time--;
	if (time == 0) { reset(); }
	$("#timer").text((time / 10).toFixed(1) + "s");
}, 100);

function reset() {
	time = maxTime;
	$("#word-list").empty();
	socket.emit('update word');
}