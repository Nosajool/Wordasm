var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var users = [];
var word = "";
var wordArr = [];
var realWord = "";
var score;

var dictionaryFile = require("./dictionary");
//var timerFile = require(".js/timer");
var time = 0;
var dictionary = dictionaryFile.dictionary();
var dictionaryArr = dictionaryFile.dictionaryArr();
var wordArr; 
var inputArr = [];

var MAX_TIME = 200;
var time = MAX_TIME;

app.get('/', function(req, res){
  res.sendfile('index.html');
});

function randomWord(){
  var randNum = Math.floor(Math.random()*58110);
  var word = dictionaryArr[randNum];
  while(word.length < 6 || word.length > 8){
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

updateWord();

function User (id, name, color, score) {
  this.id = id;
  this.name = name;
  this.color = color;
  this.score = score;
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


setInterval(function () {
  if (time == 0) { 
    console.log("updating word");
    updateWord();
    io.emit('update word', word, wordArr, realWord);
    console.log("clear input array");
    inputArr = [];    
    time = MAX_TIME;
  }
  else{   
    time--;
  }
}, 100);

app.use(express.static(__dirname+'/public'));
//io.emit('update word', word, wordArr);

io.on('connection', function(socket){

  socket.on('sync timer', function(){
    console.log("sync timer request");
    io.emit('update word', word, wordArr, realWord);
    io.emit('receive sync timer', time);
  });


  console.log('a user connected');
  io.emit('update userlist', users);

  socket.on('get users', function(){
      io.emit("user data", users);
  });

  socket.on('new user login', function(name, id, color, score){
    if(userExists(name) < 0){
      users.push(new User(id, name, color, score));
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
  socket.on('chat message', function(msg, name, id, score){
    var color = "#000000";
    for(var i=0;i<users.length;i++){
      console.log(users[i].name + users[i].id + users[i].color);
      if(users[i].id == id){
          color = users[i].color;
      }
    }
    console.log(name + ": " + msg);
    io.emit('chat message', msg, name, color, score);
  });

  socket.on('checkValidity', function(msg, score){
     console.log(inputArr);
     var currentWord = realWord;

     var secondArr = realWord.split("");
     console.log(wordArr);
     var msgArr = msg.split("");
     var firstCheck;
     var thirdCheck;
     var p;
     var count;
     //first Check: if the word is made from scrambled words
     for(var i=0;i<msgArr.length;i++){
        p=secondArr.indexOf(msgArr[i]);
        if (p==-1){
          console.log("not from scrambled");
          return;
        }
        else{
          secondArr[p]="";
        }
        firstCheck = true;
     }   
    //second check: checking if the word is in dictionary or not
    if(firstCheck == true){
      var secondCheck = dictionary.has(msg); 
    }
    if (firstCheck == false || secondCheck ==false){
      console.log("not in dictionary and not scrambled");
      return;
    }
    //third check: if the word already exists
    if (firstCheck == true && secondCheck == true){
      thirdCheck = inputArr.has(msg);
      console.log(thirdCheck);
      if (thirdCheck==true){
        console.log("word already exists");
        return;
      }
      inputArr.push(msg);
    }
    score = score + 1;
    console.log(msg + "is valid");
    io.emit('output word', msg, score);
  });
});

http.listen(process.env.PORT || 3000, function(){
  console.log('listening on *:3000');
});