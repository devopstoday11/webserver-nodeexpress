const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) return console.log('Unable to connect to MongoDb server');
  console.log('Connected to MongoDb server');

// DELETE

// deleteMany
// db.collection('Todos').deleteMany({text: 'task to delete'})
//   .then(res => console.log('deleted', res.deletedCount));

// deleteOne
// db.collection('Todos').deleteOne({text: 'improve soccer skill'})
// .then(res => console.log('deleted', res.deletedCount));

// findOneAndDelete
// useful when trying to 
db.collection('Todos').findOneAndDelete({ completed: false})
  .then(res => console.log(res));


db.close();
})