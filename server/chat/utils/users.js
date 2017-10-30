// addUser(id, name, room)
// removeUser(id)
// getUser(id)
// getUserList(room)

class Users {
  constructor() {
    this.users = [];
  }
  addUser(id, name, room) {
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

}

module.exports = {Users};
