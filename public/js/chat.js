
var socket = io();
var total = 0;

$('form').submit(function(){
	var message = $('#m');
	if (message.val() != '') {
		FB.api('/me', function(response){
			socket.emit('chat message', message.val(), response.name, response.id, score);
			socket.emit('checkValidity', message.val(), score, response.id);
			message.val('');			
		});
	}
	return false;
});

socket.on('chat message', function(msg, name, color){
	var message = "<li><span style = 'color:" + color + "'><b>" + name + "</b></span>" + ": " + msg + "</li>";
	$('.messages').append(message);
});

socket.on('output word', function(msg, score,color){
	$("#word-list").append("<li style='color: "+color+"'>"+msg+"</li>");
	$(".messages").append("<li><b>" + msg + "</b> is correct! </li>");
	//total = score + total;
	//$('.score').text(total);
});