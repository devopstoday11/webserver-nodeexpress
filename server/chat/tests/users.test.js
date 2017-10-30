const expect = require('expect');
const {Users} = require('../utils/users');

describe('Users', () => {
  it('should add new user', () => {
    var users = new Users();
    var user = {id: '123', name:'Tim', room: 'office room'}
    var res = users.addUser(user.id, user.name, user.room);
    expect(res).toEqual(user)
    expect(users.users).toEqual([user])
  })
})

