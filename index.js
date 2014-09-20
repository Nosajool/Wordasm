var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var users = [];

app.get('/', function(req, res){
  res.sendfile('index.html');
});

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
});

http.listen(process.env.PORT || 3000, function(){
  console.log('listening on *:3000');
});