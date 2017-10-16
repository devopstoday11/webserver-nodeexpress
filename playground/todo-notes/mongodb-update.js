const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) return console.log('Unable to connect to MongoDb server');
  console.log('Connected to MongoDb server');

// FIND ONE AND UPDATE
// db.collection('Todos').findOneAndUpdate({ _id: new ObjectID("59e40c8d6b7c103b05077e0c")},
//   {
//     $set: {
//       completed: true
//     }
//   },{
//     returnOriginal: false
//   })
//   .then(res => console.log(res));

db.collection('users').findOneAndUpdate({_id: new ObjectID("59e408e06b7c103b05077d7c")},
  {
    $inc: {
      age: 1
    }
  },
  {
    returnOriginal: false
  }
).then(res => console.log(res));

db.close();
})