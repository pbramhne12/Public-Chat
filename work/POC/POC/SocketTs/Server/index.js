var express = require('express');
var socket = require('socket.io');

// App setup
var app = express();
var server = app.listen(3000, function(){
    console.log('listening for requests on port 3000');
});

// Socket setup
var io = socket(server);
var numUsers = 0;

var messageCollection = [];
// Listen for new connection and print a message in console 
io.on('connection', (socket) => {
    var addedUser = false;

    console.log(`New connection ${socket.id}`)

    // Listening for chat event
    socket.on('chat', function(data){
        // console.log('chat event trigged at server');
        // console.log('need to notify all the clients about this event');
        
        messageCollection.push(data);

        io.sockets.emit('chat', data);

    });

    // when the client emits 'add user', this listens and executes
    socket.on('add user', (username) => {

        if (addedUser) return;

        // we store the username in the socket session for this client
        socket.username = username;
        ++numUsers;
        addedUser = true;
        socket.broadcast.emit('login', {
        numUsers: numUsers
        });
        // echo globally (all clients) that a person has connected
        socket.broadcast.emit('user joined', {
        username: socket.username,
        numUsers: numUsers
        });
    });



    // Listening for typing event
    socket.on('typing', function(data){
 
        // io.sockets.emit('typing', data);
        socket.broadcast.emit('typing', data);
    });

      // when the user disconnects.. perform this
    socket.on('disconnect', () => {
        if (addedUser) {
        --numUsers;
        // echo globally that this client has left
        socket.broadcast.emit('user left', {        
            username: socket.username,
            numUsers: numUsers
        });
        }
    });
    
    socket.emit("chatHistory",messageCollection)
  });
