const mongoose = require('mongoose');
const db = 'mongodb://localhost:27017/TodoApp';

mongoose.Promise = global.Promise; // to use global promises not 3rd party
mongoose.connect(db);

var Todo = mongoose.model('Todo', {
  text: {
    type: String,
    required: true,
    minLength: 1,
    trim: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Number,
    default: null
  }
});

// const newTodo = new Todo({
//   text: "Cook dinner",
// });

// newTodo.save()
// .then(doc => console.log('saved todo: ', doc))
// .catch(() => console.log('unable to save todo'));

// const otherTodo = new Todo({
//   text: 'feed cat',
//   completed: true,
//   completedAt: 123
// });

// otherTodo.save()
// .then(doc => console.log('saved todo: ', doc))
// .catch(() => console.log('unable to save todo'));

// User
// email
var User = mongoose.model('User', {
  email: {
    type: String,
    required: true,
    minLength: 1,
    trim: true
  }
});

const user = new User({
  email:"abc@gmail.com"
})

user.save()
.then( doc => console.log('saved', doc))
.catch(e => console.log(e));
