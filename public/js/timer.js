var maxTime = 200;
var time = maxTime;

setInterval(function () {
	time--;
	if (time == 0) { reset(); }
	if (time % 10 == 0) { $("#word-list").append("<li>" + time + "</li>"); }
	$("#timer").text((time / 10).toFixed(1) + "s");
}, 100);

function reset() {
	time = maxTime;
	$("#word-list").empty();
}