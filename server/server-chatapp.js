const path = require('path');
const socketIO = require('socket.io');
const http = require('http');
const express = require('express');
const {generateMessage, generateLocationMessage} = require('./chat/utils/message');

module.exports = (app) => {
  var server = http.createServer(app);
  var io = socketIO(server);
  
  app.use('/chatapp', 
    express.static(path.join(__dirname, '../public')));

  // sets up connection
  io.on('connection', (socket) => {
    console.log('new user connected on server');

    socket.emit('newMessage', generateMessage('admin', 'welcome to the app'));
    socket.broadcast.emit('newMessage', generateMessage('admin', 'new user logged in'));

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
