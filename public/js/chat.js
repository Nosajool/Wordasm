var countUsers = 0;
var socket = io();

$('form').submit(function(){
	FB.api('/me', function(response) {
		socket.emit('chat message', $('#m').val(), response.name);
		$('#m').val('');	    
	});
	return false;
});

socket.on('chat message', function(msg, name){
	$('#messages').append($('<li>').text(name + ": " + msg));
});

socket.on('update userlist', function(users){
	$('#users').empty();
	for(var i = 0; i < users.length; i++){
		$('#users').append($('<li>').text(users[i].name));
	}
	for(var i = countUsers; i>=0; i--){
		var eleId = "#login"+i;
		$(eleId).remove();
	}
	for(var i=0;i<users.length;i++){
		countUsers++;
        var eleId = "login"+i;
        $("<div id = "+eleId+" ></div>").insertAfter("#status");
		document.getElementById(eleId).style.display = "inline";
		document.getElementById(eleId).style.paddingRight = "5px";
		document.getElementById(eleId).innerHTML = '<img src="http://graph.facebook.com/' + users[i].id + '/picture" />';
    }
});

