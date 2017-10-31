const _ = require('lodash');

class Users {
  constructor() {
    this.users = [];
  }
  addUser(id, name, userRoom) {
    if (this.users.filter(user => user.name === name && user.room === userRoom).length) {
      throw new Error('user already exists in chat');
    }
    const room = this.getExistingRoom(userRoom);
    this.users.push({
      id, name, room
    })
    return {id, name, room};
  }
  removeUser(id) {
    var removed = this.getUser(id);
    this.users = this.users.filter(user => user.id !== id);
    return removed;
  }
  getUser(id) {
    return this.users.find(user => user.id === id);
  }
  getUserList(room) {
    var users = this.users.filter(user => user.room === room);
    var names = users.map(user => user.name);
    return names    
  }

  getExistingRoom(room) {
    const roomList = this.getRoomList();
    const normalizedRoomList = roomList.map(r => r.toLowerCase());
    const idx = normalizedRoomList.indexOf(room.toLowerCase());
    if (idx < 0 ) return room;
    return roomList[idx];
  }

  getRoomList() {
    var roomList = {}
    this.users.forEach(user => {
      const activeUsers = this.getUserList(user.room)
      roomList[user.room] = {
        name: user.room,
        roomSize: activeUsers.length
      }       
    });
    return _.sortBy(roomList, ['roomSize']).reverse().map(room => room.name);
  }

}

module.exports = {Users};
