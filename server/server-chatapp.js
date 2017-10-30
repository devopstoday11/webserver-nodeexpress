const path = require('path');
const socketIO = require('socket.io');
const http = require('http');
const express = require('express');
const {generateMessage, generateLocationMessage} = require('./chat/utils/message');
const {isRealString} = require('./chat/utils/validators');

module.exports = (app) => {
  var server = http.createServer(app);
  var io = socketIO(server);
  
  app.use('/chatapp', 
    express.static(path.join(__dirname, '../public')));

  // sets up connection
  io.on('connection', (socket) => {
    console.log('new user connected on server');

    socket.on('join', (params, cb) => {
      if (!isRealString(params.name) || !isRealString(params.room)) {
        cb('Name and room name are required');
      }
      socket.join(params.room);
      // io.emit -> io.to(The Office Fans).emit
      // socket.broadcast.emit -> socket.broadcast.to('The office fans).emit
      // socket.emit... same

      socket.emit('newMessage', generateMessage('admin', 'Welcome to the chat app'));
      socket.broadcast.to(params.room).emit('newMessage', generateMessage('admin', `${params.name} has joined`));
  
      cb();
    });

    socket.on('createMessage', ({from, text}, callback) => {
      io.emit('newMessage', generateMessage(from, text));
      callback();
    });

    socket.on('createLocationMessage', ({latitude, longitude}) => {
      io.emit('newLocationMessage', generateLocationMessage('admin', latitude, longitude));
    })

    socket.on('disconnect', () => {
      console.log('disconnected from server');
    })
  });

  return server;
}
