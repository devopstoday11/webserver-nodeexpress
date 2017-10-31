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
    var user = {id: '123', name:'Timmy', room: 'office room'}
    var res = users.addUser(user.id, user.name, user.room);
    expect(res).toEqual(user)
    expect(users.users).toEqual([user])
  });

  it('should not add a new user with same name to same room', () => {
    var user = {id: '123', name:'Tim', room: 'Node Course'}
    expect(() => users.addUser(user.id, user.name, user.room)).toThrow();
    expect(users.users.length).toBe(3)
  });

  it('should add user with same name to different room', () => {
    var user = {id: '1243', name:'Tim', room: 'React Course'}
    var res = users.addUser(user.id, user.name, user.room);
    expect(res).toEqual(user);
    expect(users.users.length).toBe(4);
    expect(users.users).toContainEqual(res);
  });

  it('should add a new user to room regardless of case', () => {
    var user = {id: '123', name:'John3', room: 'node course'}
    var user2 = {id: '134', name:'John4', room: 'Node course'}
    var res = users.addUser(user.id, user.name, user.room);
    var res2 = users.addUser(user2.id, user2.name, user2.room);
    expect(res.room).toBe('Node Course');
    expect(res2.room).toBe('Node Course');
    expect(users.users.length).toBe(5);
    expect(users.getRoomList().length).toBe(2);
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

  it('should return list of rooms sorted by their size', ()=> {
    var roomList = users.getRoomList();
    expect(roomList.length).toBe(2);
    expect(roomList[0]).toBe('Node Course');
  })


})

