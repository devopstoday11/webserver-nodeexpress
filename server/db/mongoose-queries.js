const {mongoose} = require('./mongoose');
const {Todo} = require('../models/todo');
const { ObjectID } = require('mongodb');

const id = "59e60520ad665679d1c2eecb";

if (!ObjectID.isValid(id)) console.log('Invalid Id');

else {
  Todo.find({ _id: id}).then(todos => console.log('Todos', todos));

  Todo.findOne({ _id: id}).then(todo => console.log('Todo', todo));

  Todo.findById(id).then(todo => {
    if (!todo) return console.log('ID not found');
    console.log('Todo by Id', todo)
  });
}

