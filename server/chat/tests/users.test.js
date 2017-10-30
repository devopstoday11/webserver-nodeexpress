const expect = require('expect');
const {Users} = require('../utils/users');


describe('Users', () => {
  beforeEach(() => {
    users = new Users();
    users.users = [
      {
        id: '1',
        name: 'Tim',
        room: 'Node Course'
      },
      {
        id: '2',
        name: 'Jen',
        room: 'React Course'
      },
      {
        id: '3',
        name: 'John',
        room: 'Node Course'
      },
    ]
  });
  
  it('should add new user', () => {
    var users = new Users();
    var user = {id: '123', name:'Tim', room: 'office room'}
    var res = users.addUser(user.id, user.name, user.room);
    expect(res).toEqual(user)
    expect(users.users).toEqual([user])
  });

  it('should remove a user by id', () => {
    var removed = users.removeUser('1');
    expect(removed.name).toBe('Tim');
    expect(removed.id).toBe('1');
    expect(users.users.length).toBe(2);
  });

  it('should not remove a user by wrong id', () => {
    var removed = users.removeUser('4567');
    expect(users.users.length).toBe(3);
  });

  it('should find a user by id', () => {
    var user = users.getUser('1');
    expect(user.name).toBe('Tim');
    expect(user.id).toBe('1')
  });

  it('should not get a user by wrong id', () => {
    var user = users.getUser('4567');
    expect(user).toBeFalsy();
  });


  it('should return names for node course', () => {
    var userList = users.getUserList('Node Course');
    expect(userList).toEqual(['Tim', 'John'])
  });

  it('should return names for react course', () => {
    var userList = users.getUserList('React Course');
    expect(userList).toEqual(['Jen'])
  });




})

