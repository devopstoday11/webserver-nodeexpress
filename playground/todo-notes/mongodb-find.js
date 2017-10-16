const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) return console.log('Unable to connect to MongoDb server');
  console.log('Connected to MongoDb server');


// READ

// db.collection('Todos').find({completed: false}).toArray()
//   .then(docs => console.log(docs))
//   .catch(err => console.log('could not get documetns as array'));

// db.collection('Todos').find(new ObjectID('59e3fca66b7c103b05077c85')).toArray()
//   .then(docs => console.log(docs))
//   .catch(err => console.log('could not get documetns as array'));

// other methods
// mongodb docs below

// db.collection('Todos').find().count()
//   .then( count => console.log(`Todos count: ${count}`))
//   .catch(err => console.log('Failed to count: ', err))

// db.collection('users').find({name: 'Tim'}).toArray()
//   .then(docs => console.log(docs))
//   .catch(err => console.log('Failed to count: ', err))

// DELETE


db.close();
})