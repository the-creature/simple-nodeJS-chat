var express = require('express'),
    app = express(),
    http = require('http').Server(app),
    port = process.env.PORT || 3000,
    io = require('socket.io')(http);

app.use(express.static('public'));

var userNames = [];

io.on('connection', function(socket){
  console.log('a user connected');

  socket.on('disconnect', function(){
    console.log('user disconnected');

    if(socket.userName != null) {
        var userNameIndex = userNames.indexOf(socket.userName);

        if(userNameIndex > -1)
            userNames.splice(userNameIndex, 1);
    }

    io.emit('userNames', userNames); 
  });

  socket.on('chat message', function(msg){
    console.log('message: ' + msg);
    var obj = {
        userName: socket.userName,
        msg: msg
    };

    io.emit('chat message', obj);
  });

  socket.on('name', function(person) {
    socket.userName = person;

    console.log('we got name: ' + person)
    socket.broadcast.emit('newUser', person);

    userNames.push(person);

    io.emit('userNames', userNames); 
  });
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});