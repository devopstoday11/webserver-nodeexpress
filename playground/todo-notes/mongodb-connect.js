const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) return console.log('Unable to connect to MongoDb server');
  console.log('Connected to MongoDb server');
  
  // db.collection('users').insertOne({firstName: 'testName', lastName: 'testLastName'}, (err, result) => {
  //   if (err) return console.log('unable to insert todo', err);
  //   console.log(JSON.stringify(result.ops, undefined, 2));
  // })

  // when data is created
  // _id encodes a timestamp as first 4 bytes
  // you can use _id.getTimeStamp() => timestamp
  // can make and use object id
  
  const obj = new ObjectID();
  console.log(obj, obj.getTimestamp());

  db.close();
})