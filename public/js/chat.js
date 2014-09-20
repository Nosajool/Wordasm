var countUsers = 0;
var socket = io();

$('form').submit(function(){
	var message = $('#m');
	if (message.val() != '') {
		socket.emit('chat message', message.val());
		message.val('');
	}
	return false;
});

socket.on('chat message', function(msg){
	$('.messages').append($('<li>').text(msg));
});