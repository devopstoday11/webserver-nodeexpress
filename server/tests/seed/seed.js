const {ObjectID} = require('mongodb');
const {Todo} = require('../../models/todo');
const {User} = require('../../models/user');
const jwt = require('jsonwebtoken');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();

const users = [
  {
    _id: userOneId,
    email: 'timu@example.com',
    password: 'userOnePass',
    tokens: [{
      access: 'auth',
      token: jwt.sign({_id: userOneId, access:'auth'}, process.env.JWT_SECRET).toString()
    }]
  },
  {
    _id: userTwoId,
    email: 'jen@example.com',
    password: 'userTwoPass',
    tokens: [{
      access: 'auth',
      token: jwt.sign({_id: userTwoId, access:'auth'}, process.env.JWT_SECRET).toString()
    }]  
  }
];

const todos = [
  {
    _id: new ObjectID(), 
    text: "first test todo",
    _creator: userOneId
  },
  {
    _id: new ObjectID(), 
    text: "second test todo", 
    completed: true, 
    compeltedAt: 333,
    _creator: userTwoId
  }
];


const populateTodos = done => {
  // remove it all
  Todo.remove({}).then(() => {
    return Todo.insertMany(todos);
  }).then(() => done());
};

const populateUsers = done => {
  User.remove({}).then(() => {
    // need to save individually to do salting / hashing
    var userOne = new User(users[0]).save();
    var userTwo = new User(users[1]).save();
    return Promise.all([userOne, userTwo])
  }).then(() => done());
}

module.exports = {todos, populateTodos, users, populateUsers};