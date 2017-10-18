const {mongoose} = require('../../server/db/mongoose');
const {Todo} = require('../../server/models/todo');
const {User} = require('../../server/models/user')
const { ObjectID } = require('mongodb');

// remove all use {}
// no docs back
// Todo.remove({}).then(res => console.log(res));

// returns back
// Todo.findOneAndRemove()

Todo.findByIdAndRemove("59e776fc6b7c103b05079624").then(todo => console.log(todo));
