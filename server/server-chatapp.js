const path = require('path');
const socketIO = require('socket.io');
const http = require('http');
const express = require('express');

module.exports = (app) => {
  var server = http.createServer(app);
  var io = socketIO(server);
  
  app.use('/chatapp', 
    express.static(path.join(__dirname, '../public')));

  // sets up connection
  io.on('connection', (socket) => {
    console.log('new user connected on server');

    socket.emit('newMessage', {
      from: 'admin',
      text: 'welcome to chat app',
      createdAt: new Date().getTime()
    })
    socket.broadcast.emit('newMessage', {
      from: 'admin',
      text: 'new user joined',
      createdAt: new Date().getTime()
    })


    socket.on('createMessage', (message) => {
      console.log('create Message', message);
      // this is to everyone
      io.emit('newMessage', {
        from: message.from,
        text: message.text,
        createdAt: new Date().getTime()
      });
      // only received by other connections
      // socket.broadcast.emit('newMessage', {
      //   from: message.from,
      //   text: message.text,
      //   createdAt: new Date().getTime()
      // });
    })

    socket.on('disconnect', () => {
      console.log('disconnected from server');
    })
  });

  return server;
}
