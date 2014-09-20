
var socket = io();

$('form').submit(function(){
	var message = $('#m');
	if (message.val() != '') {
		FB.api('/me', function(response){
			socket.emit('chat message', message.val(), response.name);
			message.val('');			
		});
	}
	return false;
});

socket.on('chat message', function(msg, name){
	$('.messages').append($('<li>').text(name + ": " + msg));
});

