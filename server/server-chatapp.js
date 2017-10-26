const path = require('path');
const socketIO = require('socket.io');
const http = require('http');
const express = require('express');
const {generateMessage} = require('./chat/utils/message');

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
      // console.log('create Message', message.from, message.text);
      // this is to everyone
      io.emit('newMessage', generateMessage(from, text));

      callback('this is from server');
      // only received by other connections
      // socket.broadcast.emit('newMessage', {
      //   from: message.from,
      //   text: message.text,
      //   createdAt: new Date().getTime()
      // });
    });

    socket.on('createLocationMessage', ({latitude, longitude}) => {
      //
      io.emit('newMessage', generateMessage('admin', `${latitude}, ${longitude}`))
    })

    socket.on('disconnect', () => {
      console.log('disconnected from server');
    })
  });

  return server;
}
