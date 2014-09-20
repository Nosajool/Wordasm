
var socket = io();

$('form').submit(function(){
	var message = $('#m');
	if (message.val() != '') {
		FB.api('/me', function(response) {
			socket.emit('chat message', $('#m').val(), response.name);
			$('#m').val('');	    
		});
	}
	return false;
});

socket.on('chat message', function(msg, name){
	console.log("random stuff");
	$('#messages').append($('<li>').text(name + ": " + msg));
});
