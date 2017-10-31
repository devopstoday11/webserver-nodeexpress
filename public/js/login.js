var socket = io();

socket.on('getRoomList', (rooms) => {
  var $select = jQuery('#select-room');
  $name = jQuery('input[name="room"]');

  console.log(rooms);
  $select.empty().append('<option value="" disabled selected>Select a Room</option>');
  rooms.forEach( function(room) {
    $select.append(jQuery('<option>').val(room.toLowerCase()).text(room));
  });
  // update name field when option selected
  $select.on('change', function(evt) {        
    $name.val(evt.target.selectedOptions[0].text);
  })
  // update selected when name is changed
  $name.on('keyup', function(evt) {
    $select.val(evt.target.value.toLowerCase());
  });
})