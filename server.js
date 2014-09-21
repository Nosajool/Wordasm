var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var users = [];
var word = "";
var wordArr = [];
var realWord = "";

var dictionaryFile = require("./dictionary");

var dictionary = dictionaryFile.dictionary();
var dictionaryArr = dictionaryFile.dictionaryArr();
var wordArr; 
var inputArr;

app.get('/', function(req, res){
  res.sendfile('index.html');
});

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
  realWord = word;
  console.log(word);
  var len = word.length;
  wordArr = word.split("");
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

function combineWord(wordArr){
  var word = "";
  for(var i=0;i<wordArr.length;i++){
    word += wordArr[i]+" ";
  }
  return word;
}

function updateWord(){
  wordArr = scrambleWord();
  word = combineWord(wordArr);
}

function User (id, name, color) {
  this.id = id;
  this.name = name;
  this.color = color;
  this.getId = function(){
    return this.id;
  }
  this.getName = function(){
    return this.name;
  }
}

var users = [];

function userExists(name){
  for(var i = 0; i < users.length; i++){
    if(users[i].name == name){
        console.log("FOUND " + name + " at position " + i);
        return i;
    }
  }
  return -1;
}

app.use(express.static(__dirname+'/public'));
//io.emit('update word', word, wordArr);

io.on('connection', function(socket){
  console.log('a user connected');
  io.emit('update userlist', users);

  socket.on('get users', function(){
      io.emit("user data", users);
  });

  socket.on('new user login', function(name, id, color){
    if(userExists(name) < 0){
      users.push(new User(id, name, color));
      console.log("Color: "+users[0].color);
      console.log("new user added: " + name);
      io.emit('update userlist', users);
    }
    else{
      console.log(name + " already is in the game");
    }
  });

  socket.on('user logout', function(name, id){
      for(var i = 0; i<users.length; i++){
          if(users[i].id == id){
              users.splice(i, 1);
              break;
          }
      }
      console.log("user removed: "+name);
      io.emit('update userlist', users);
  });

  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
  socket.on('chat message', function(msg, name, id){
    var color = "#000000";
    for(var i=0;i<users.length;i++){
      console.log(users[i].name + users[i].id + users[i].color);
      if(users[i].id == id){
          color = users[i].color;
      }
    }
    console.log(name + ": " + msg);
    io.emit('chat message', msg, name, color);
  });

  socket.on('update word', function(){
    console.log("updating word");
    updateWord();
    io.emit('update word', word, wordArr, realWord);
  });

  socket.on('checkValidity', function(msg){
     var msgArr = msg.split("");
     var firstCheck;
     var thirdCheck;
     var p;
     var isValid;
     inputArr.push(msg);
     //first Check: if the word is made from scrambled words
     for(var i=0;i<msgArr.length;i++){
        p=wordArr.indexOf(msgArr[i]);
        if (p==-1){
          firstCheck = false;
          break;
        }
        else{
          wordArr[p]="";
        }
        firstCheck = true;
     }   
    //second check: checking if the word is in dictionary or not
    if(firstCheck == true){
      var secondCheck = dictionary.has(msg); 
    }
    if (firstCheck == false || secondCheck ==false){
      isValid = false;
    }
    //third check: if the word already exists
    if (firstCheck == true && secondCheck == true){
      thirdCheck = inputArr.has(msg);
      if (thirdCheck==false){
        isValid = false;
      } 
    }
    isValid = true;
    console.log(msg + "'s validity? = " + isValid);
    io.emit('checkValidity', msg, isValid);
  });
});

http.listen(process.env.PORT || 3000, function(){
  console.log('listening on *:3000');
});