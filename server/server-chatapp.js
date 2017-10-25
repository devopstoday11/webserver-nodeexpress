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

    socket.on('disconnect', () => {
      console.log('disconnected from server');
    })
  });



  return server;
}
