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

}

module.exports = {Users};
