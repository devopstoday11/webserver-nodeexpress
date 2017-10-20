const _ = require('lodash');
const { ObjectID } = require('mongodb');
const bodyParser = require('body-parser');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');
const {authenticate} = require('./middleware/authenticate');

module.exports = (app) => {
  console.log('configuring controller routes...');  
  app.use(bodyParser.json());

  app.post('/todos', (req, res) => {
    const { text } = req.body;
    const todo = new Todo({ text });
  
    todo.save().then(doc => res.send(doc)).catch(e => res.status(400).send(e));
  });
  
  app.get('/todos', (req, res) => {
    // object allows for more flexible future
    Todo.find()
      .then(todos => res.send({ todos }))
      .catch(e => res.status(500).send(e));
  });
  
  app.get('/todos/:id', (req, res) => {
    const { id } = req.params;
    if (!ObjectID.isValid(id)) {
      return res.status(404).send();
    }
  
    Todo.findById(id)
      .then(todo => {
        if (!todo) return res.status(404).send();
        res.send({ todo });
      })
      .catch(() => res.status(400).send());
  });
  
  app.delete('/todos/:id', (req, res) => {
    const {id} = req.params;
    if (!ObjectID.isValid(id)) {
      return res.status(404).send();
    }

    Todo.findByIdAndRemove(id)
      .then(todo => {
        if (!todo) return res.status(404).send();
        res.send({ todo });
      })
      .catch(() => res.status(400).send());
  })

  app.patch('/todos/:id', (req, res) => {
    const { id } = req.params;
    const body = _.pick(req.body, ['text', 'completed']);
    if (!ObjectID.isValid(id)) return res.status(404).send();
    
    if (_.isBoolean(body.completed) && body.completed) {
      body.completedAt = new Date().getTime();
    } else {
      body.completed = false;
      body.completedAt = null;
    }

    Todo.findByIdAndUpdate(id, {$set: body}, {new: true})
      .then(todo => {
        if (!todo) return res.status(404).send();
        res.send({ todo });
      })
    .catch(() => res.status(400).send());
  });

  // USERS

  app.post('/users', (req, res) => {
    const body = _.pick(req.body, ['email', 'password']);
    const user = new User(body);
    
    // User.findByToken
    user.generateAuthToken();
    // x-auth is a custom header
    
    user.save()
      .then(() => user.generateAuthToken())
      .then(token => res.header('x-auth', token).send(user))
      .catch(e => res.status(400).send(e));    
  });

  app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user);
  });

  return app;
}