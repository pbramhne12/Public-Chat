const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers
} = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Set static folder
// app.use(express.static(path.join(__dirname, 'public')));

const botName = 'Chat Bot';

var RoommessageCollection = [];
var PrivatemessageCollection = [];

// Run when client connects
io.on('connection', socket => {
  
  socket.on('joinRoom', ({ username, room }) => {

    console.log( username, room)
    const user = userJoin(socket.id, username, room);

    socket.join(user.room);

    // Welcome current user
    socket.emit('message', formatMessage(botName, 'Welcome to Public Chat!'));

    // Broadcast when a user connects
    socket.broadcast
      .to(user.room)
      .emit(
        'message',
        formatMessage(botName, `${user.username} has joined the chat`)
      );

    // Send users and room info
    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getRoomUsers(user.room)
    });

  });



  // Listen for chatMessage
  socket.on('chatMessage', msg => {
    const user = getCurrentUser(socket.id);

    //store the Public Data Messages for Room
    RoommessageCollection.push(formatMessage(user.username, msg));
    
    io.to(user.room).emit('message', formatMessage(user.username, msg));
  });


  

  // when the client emits 'typing', we broadcast it to others
  socket.on('typing', () => {
    const user = getCurrentUser(socket.id);

    socket.broadcast.emit('typing', {
      username: user.username
    });
  });

  // when the client emits 'stop typing', we broadcast it to others
  socket.on('stop typing', () => {
    const user = getCurrentUser(socket.id);
    socket.broadcast.emit('stop typing', {
      username: user.username
    });
  });

  // Runs when client disconnects
  socket.on('disconnect', () => {
    const user = userLeave(socket.id);

    if (user) {
      io.to(user.room).emit(
        'message',
        formatMessage(botName, `${user.username} has left the chat`)
      );

      // Send users and room info
      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room)
      });
    }
  });

  //For Private Messages only
  socket.on('getMsg', (data) => {
    socket.leave(socket.room);

    socket.join(data.toid);
    socket.broadcast.to(data.toid).emit('sendMsg',
    formatMessage(data.name, data.msg));

    socket.emit("sendMsg", formatMessage(data.name, data.msg));
  });

  socket.emit("chatHistory",RoommessageCollection);

});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
