var env = process.env.NODE_ENV || 'development';

// test env db
if (env === 'development') {
  process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp';
  process.env.PORT = 3000;
} else if (env === 'test') {
  process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest';
  process.env.PORT = 3000;
}

console.log('*** [ENV]', env, '\n*** [DB]', process.env.MONGODB_URI);