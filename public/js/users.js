var countUsers = 0;

socket.on('update userlist', function(users){
	console.log("update userlist");
	$('.users').empty();
	for(var i = 0; i < users.length; i++){
		var message = "<li><span style = 'color:" + users[i].color + "'>" + users[i].name + "</span></li>";
		$('.users').append(message);
	}
	for(var i = countUsers; i>=0; i--){
		var eleId = "#login"+i;
		$(eleId).remove();
	}
	$("#user-container").empty();
	for(var i=0;i<users.length;i++){
		countUsers++;
        // var eleId = "login"+i;
        // $("<div id=" + eleId + "></div>").insertAfter("#status");
		// document.getElementById(eleId).innerHTML = ;
		$('#user-container').append('<img name="'+users[i].name+'"class="user-icons" style="border: 5px solid '+users[i].color+'" src="http://graph.facebook.com/' + users[i].id + '/picture">');
    }
});