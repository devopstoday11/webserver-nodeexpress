var socket = io(); // initiate request
socket.on('connect', function() {
  console.log('connected to server');

  // socket.emit('createMessage', {
  //   from: 'tim@gmail.com',
  //   text: 'Hey this is Tim'
  // })
});

socket.on('disconnect', function() {
  console.log('disconnected from server');
})

socket.on('newMessage', function(message) {
  console.log('new message', message);
  var li = jQuery('<li></li>');
  li.text(`${message.from}: ${message.text}`);
  jQuery('#messages').append(li);
  // to every connection
})

// socket.emit('createMessage', {
//   from: 'tim',
//   text: 'welcome here'
// }, (data) => {
//   console.log('got it', data);
// })

// jquery
jQuery('#message-form').on('submit', function(e) {
  e.preventDefault();
  socket.emit('createMessage', {
    from: 'User',
    text: jQuery('input[name=message]').val()
  }, function() {

  })
});

var locationBtn = jQuery('#send-location');
locationBtn.on('click', function() {
  if (!navigator.geolocation) {
    return alert('geolocation not supported by your browser.');
  }

  navigator.geolocation.getCurrentPosition(
    function(position){
      socket.emit('createLocationMessage', {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      })
      // console.log(position);

  }, function() {
    alert('unable to fetch location')
  });
});