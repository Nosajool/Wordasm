
var socket = io();

$('form').submit(function(){
	var message = $('#m');
	if (message.val() != '') {
		FB.api('/me', function(response){
			socket.emit('chat message', message.val(), response.name, response.id);
			socket.emit('checkValidity', message.val());
			message.val('');			
		});
	}
	return false;
});

socket.on('chat message', function(msg, name, color){
	var message = "<li><span style = 'color:" + color + "'><b>" + name + "</b></span>" + ": " + msg + "</li>";
	$('.messages').append(message);
});

socket.on('output word', function(msg){
	$("#word-list").append("<li style='color: "+color+"'>"+msg+"</li>");
});