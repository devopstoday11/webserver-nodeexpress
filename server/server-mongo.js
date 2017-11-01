const _ = require('lodash');
const { ObjectID } = require('mongodb');
const bodyParser = require('body-parser');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');
const {authenticate} = require('./middleware/authenticate');

module.exports = (app) => {
  console.log('configuring controller routes...');  
  app.use(bodyParser.json());

  app.post('/todos', authenticate, (req, res) => {
    const { text } = req.body;
    const todo = new Todo({ 
      text,
      _creator: req.user._id
     });
  
    todo.save().then(doc => res.send(doc)).catch(e => res.status(400).send(e));
  });
  
  app.get('/todos', authenticate, (req, res) => {
    // only show todos for logged in user
    Todo.find({ _creator: req.user._id })
      .then(todos => res.send({ todos }))
      .catch(e => res.status(500).send(e));
  });
  
  app.get('/todos/:id', authenticate, (req, res) => {
    const { id } = req.params;
    if (!ObjectID.isValid(id)) {
      return res.status(404).send();
    }
  
    Todo.findOne({ _id: id, _creator: req.user._id })
      .then(todo => {
        if (!todo) return res.status(404).send();
        res.send({ todo });
      })
      .catch(() => res.status(400).send());
  });
  
  app.delete('/todos/:id', authenticate, async (req, res) => {
    const {id} = req.params;
    if (!ObjectID.isValid(id)) {
      return res.status(404).send();
    }

    try {
      const todo = await Todo.findOneAndRemove({_id: id, _creator: req.user._id});
      if (!todo) return res.status(404).send();
      res.send({ todo });
    } catch(e) {
      res.status(400).send();
    }
  })

  app.patch('/todos/:id', authenticate, (req, res) => {
    const { id } = req.params;
    const body = _.pick(req.body, ['text', 'completed']);
    if (!ObjectID.isValid(id)) return res.status(404).send();
    
    if (_.isBoolean(body.completed) && body.completed) {
      body.completedAt = new Date().getTime();
    } else {
      body.completed = false;
      body.completedAt = null;
    }

    Todo.findOneAndUpdate({_id: id, _creator: req.user._id},
      {$set: body}, {new: true})
      .then(todo => {
        if (!todo) return res.status(404).send();
        res.send({ todo });
      })
    .catch(() => res.status(400).send());
  });

  // USERS

  app.post('/users', async (req, res) => {
    try {
      const body = _.pick(req.body, ['email', 'password']);
      const user = new User(body);
      await user.save();
      const token = await user.generateAuthToken();
      res.header('x-auth', token).send(user);
    } catch(e) {
      res.status(400).send(e);
    }
  });

  app.get('/users/me', authenticate, (req, res) => res.send(req.user));

  app.post('/users/login', async (req, res) => {
    try {
      const {email, password} = req.body;
      const user = await User.findByCredentials(email, password);
      const token = await user.generateAuthToken();
      res.header('x-auth', token).send(user);
    } catch(e) {
      res.status(400).send();
    }
  });

  app.delete('/users/me/token', authenticate, async (req, res) => {    
    try {
      await req.user.removeToken(req.token);
      res.status(200).send();
    } catch(e) {
      res.status(400).send();
    }
  })

  return app;
}