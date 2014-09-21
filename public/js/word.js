var socket = io();

socket.on('update word', function(word, wordArr, realWord){
	var message = word;
	console.log("update word: "+realWord);
	$('#big-word').html(word);
	// $('#word-list').empty();
});