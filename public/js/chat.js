
// scroll user to bottom
function scrollToBottom() {
  // selectors
  var messages = jQuery('#messages');
  var newMessage = messages.children('li:last-child');

  // heights
  var clientHeight = messages.prop('clientHeight');
  var scrollTop = messages.prop('scrollTop');
  var scrollHeight = messages.prop('scrollHeight');
  var newMessageHeight = newMessage.innerHeight();
  var lastMessageHeight = newMessage.prev().innerHeight();  

  if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
    messages.scrollTop(scrollHeight);
  }
}

var socket = io(); // initiate request


socket.on('connect', function() {
  var params = jQuery.deparam(window.location.search);
  socket.emit('join', params, function(err) {
    if (err) {
      // redirect
      alert(err);
      window.location.href = '/chatapp/';
    } else {
      console.log('No error');
    }
  });
  console.log('connected to server');
});

socket.on('disconnect', function() {
  console.log('disconnected from server');
})

socket.on('updateUserList', function(users) {
  console.log('User List', users);
  var ol = jQuery('<ol></ol>');
  users.forEach(function(user) {
    ol.append(jQuery('<li></li>').text(user))
  })
  jQuery('#users').html(ol);
})

socket.on('newMessage', function(message) {
  console.log('new message', message);
  var template = jQuery('#message-template').html();
  var formattedTime = moment(message.createdAt).format('h:mm a');

  var html = Mustache.render(template, {
    from: message.from,
    text: message.text,
    createdAt: formattedTime
  });
  jQuery('#messages').append(html);
  scrollToBottom();
 });

socket.on('newLocationMessage', function(message) {
  console.log('new location message', message);
  var formattedTime = moment(message.createdAt).format('h:mm a');  
  var template = jQuery('#message-location-template').html();
  var html = Mustache.render(template, {
    from: message.from,
    url: message.url,
    createdAt: formattedTime
  });
  jQuery('#messages').append(html);
  scrollToBottom();
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
