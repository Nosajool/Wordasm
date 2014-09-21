function randomWord(){
	var randNum = Math.floor(Math.random()*58110);
	var word = dictionaryArr[randNum];
	while(word.length < 7){
		randNum = (randNum+1)%58110;
		word = dictionaryArr[randNum];
	}
	return word;
}

function scrambleWord(){
	var word = randomWord();
	console.log(word);
	var len = word.length;
	var wordArr = word.split("");
	var usedInt = [];
	var newWord = [];

	while(usedInt.length < len){
		var randInt = Math.floor(Math.random()*len);
		while(usedInt.indexOf(randInt)!= -1){
			var randInt = Math.floor(Math.random()*len);
		}

		newWord.push(wordArr[randInt]);
		usedInt.push(randInt);

	}
	return newWord;
}

console.log(scrambleWord());

// module.exports = {
// 	scrambleWord: function(){
// 		return scrambleWord();
// 	},

// 	randomWord: function(){
// 		return randomWord();
// };
// 	}