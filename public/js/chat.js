var socket = io();

$('form').submit(function(){
	socket.emit('chat message', $('#m').val());
	$('#m').val('');
	return false;
});

socket.on('chat message', function(msg){
	$('#messages').append($('<li>').text(msg));
});

socket.on('update userlist', function(users){
	$('#users').empty();
	for(var i = 0; i < users.length; i++){
		$('#users').append($('<li>').text(users[i]));
	}
});