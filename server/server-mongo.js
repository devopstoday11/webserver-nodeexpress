const { ObjectID } = require('mongodb');
const bodyParser = require('body-parser');
const {Todo} = require('./models/todo');

module.exports = (app) => {
  console.log('configuring controller...', app);  
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
  });
  
  app.get('/todos/:id', (req, res) => {
    const { id } = req.params;
    if (!ObjectID.isValid(id)) {
      console.log('invalid id sent');
      return res.status(404).send();
    }
  
    Todo.findById(id)
      .then(todo => {
        if (!todo) return res.status(404).send();
        res.send({ todo });
      })
      .catch(() => res.status(400).send());
  });  
  return app;
}