const express = require('express');
const bodyParser = require('body-parser');

const {Todo} = require('./models/todo');
const {User} = require('./models/user');

var app = express();

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
  console.log(req.body);
  const { text } = req.body;
  const todo = new Todo({ text });

  todo.save().then(doc => res.send(doc)).catch(e => res.status(400).send(e));
});

app.get('/todos', (req, res) => {
  // object allows for more flexible future
  Todo.find()
    .then(todos => res.send({ todos }))
    .catch(e => res.status(500).send(e));
})

app.listen(3000, () => console.log('listening at 3000'));

module.exports = {app};