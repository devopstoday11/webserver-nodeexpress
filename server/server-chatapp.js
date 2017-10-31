const path = require('path');
const socketIO = require('socket.io');
const http = require('http');
const express = require('express');
const {generateMessage, generateLocationMessage} = require('./chat/utils/message');
const {isRealString} = require('./chat/utils/validators');
const {Users} = require('./chat/utils/users');

module.exports = (app) => {
  var server = http.createServer(app);
  var io = socketIO(server);
  var users = new Users();
  
  app.use('/chatapp', 
    express.static(path.join(__dirname, '../public')));

  // sets up connection
  io.on('connection', (socket) => {
    console.log('new user connected on server');

    socket.on('join', (params, cb) => {
      if (!isRealString(params.name) || !isRealString(params.room)) {
        return cb('Name and room name are required');
      }
      socket.join(params.room);
      users.removeUser(socket.id);
      users.addUser(socket.id, params.name, params.room);
      io.to(params.room).emit('updateUserList', users.getUserList(params.room));
      // io.emit -> io.to(The Office Fans).emit
      // socket.broadcast.emit -> socket.broadcast.to('The office fans).emit
      // socket.emit... same

      socket.emit('newMessage', generateMessage('admin', 'Welcome to the chat app'));
      socket.broadcast.to(params.room).emit('newMessage', generateMessage('admin', `${params.name} has joined`));
  
      cb();
    });

    socket.on('createMessage', ({from, text}, callback) => {
      var user = users.getUser(socket.id);

      if(user && isRealString(text)) {
        io.to(user.room).emit('newMessage', generateMessage(user.name, text));              
      }
      callback();
    });

    socket.on('createLocationMessage', ({latitude, longitude}) => {
      var user = users.getUser(socket.id);

      if(user) {
        io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, latitude, longitude));
      }
      
    })

    socket.on('disconnect', () => {
      console.log('disconnected from server');
      
      var user = users.removeUser(socket.id);
      if (user) {
        io.to(user.room).emit('updateUserList', users.getUserList(user.room));
        io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left`));
      }

    })
  });

  return server;
}
