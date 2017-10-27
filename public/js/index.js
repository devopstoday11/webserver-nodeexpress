var socket = io(); // initiate request
socket.on('connect', function() {
  console.log('connected to server');
});

socket.on('disconnect', function() {
  console.log('disconnected from server');
})

socket.on('newMessage', function(message) {
  console.log('new message', message);
  var formattedTime = moment(message.createdAt).format('h:mm a');
  var li = jQuery('<li></li>');
  li.text(`${message.from} ${formattedTime}: ${message.text}`);
  jQuery('#messages').append(li);
});

socket.on('newLocationMessage', function(message) {
  console.log('new location message', message);
  var li = jQuery('<li></li>');
  var a = jQuery('<a target="_blank">My Current location</a>');
  var formattedTime = moment(message.createdAt).format('h:mm a');  
  li.text(`${message.from} ${formattedTime}: `);
  a.attr('href', message.url);
  li.append(a);
  jQuery('#messages').append(li);
});

// jquery
jQuery('#message-form').on('submit', function(e) {
  e.preventDefault();
  var messageTextBox = jQuery('input[name=message]');  
  socket.emit('createMessage', {
    from: 'User',
    text: messageTextBox.val()
  }, function() {
    messageTextBox.val(''); // clear
  })
});

var locationBtn = jQuery('#send-location');
locationBtn.on('click', function() {
  if (!navigator.geolocation) {
    return alert('geolocation not supported by your browser.');
  }
    
  locationBtn.prop('disabled', true).text('Sending location...');
  
  navigator.geolocation.getCurrentPosition(
    function(position){
      locationBtn.prop('disabled', false).text('Send Location');      
      socket.emit('createLocationMessage', {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      });

  }, function() {
    locationBtn.prop('disabled', false).text('Send Location');      
    alert('unable to fetch location')
  });
});