const path = require('path');
const socketIO = require('socket.io');
const http = require('http');
const express = require('express');

module.exports = (app) => {
  var server = http.createServer(app);
  var io = socketIO(server);
  
  app.use('/chatapp', 
    express.static(path.join(__dirname, '../public')));
  // setup the connection

  io.on('connection', (socket) => {
    console.log('new user connected on server');

    // socket.emit('newMessage', {
    //   from: 'mike@example.com',
    //   text: 'Hey what is up',
    //   createdAt: 13
    // });

    socket.on('createMessage', (message) => {
      console.log('create Message', message);
      io.emit('newMessage', {
        from: message.from,
        text: message.text,
        createdAt: new Date().getTime()
      });
    })

    socket.on('disconnect', () => {
      console.log('disconnected from server');
    })
  });

  return server;
}
