var countUsers = 0;

socket.on('update userlist', function(users){
	$('.users').empty();
	for(var i = 0; i < users.length; i++){
		var message = "<li><span style = 'color:" + users[i].color + "'>" + users[i].name + "</span></li>";
		$('.users').append(message);
	}
	for(var i = countUsers; i>=0; i--){
		var eleId = "#login"+i;
		$(eleId).remove();
	}
	for(var i=0;i<users.length;i++){
		countUsers++;
        var eleId = "login"+i;
        $("<div class='user-icons' id=" + eleId + "></div>").insertAfter("#status");
		document.getElementById(eleId).innerHTML = '<img src="http://graph.facebook.com/' + users[i].id + '/picture" />';
    }
});

