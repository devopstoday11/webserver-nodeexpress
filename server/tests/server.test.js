const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

// get root server
const {app} = require('../../server');
const {Todo} = require('../models/todo');
const {User} = require('../models/user');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);


describe('POST /todos', () => {
  it('should create a new todo', done => {
    var text = 'test todo text';

    request(app)
      .post('/todos')
      .send({text})
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text);
      })
      .end((err, res) => {
        if (err){
          return done(err);
        }

        Todo.find({text}).then(todos => {
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done();
        }).catch(e => done(e));
      })
  })

  it('should not create todo with invalid body', done => {
    request(app)
      .post('/todos')
      .send({})
      .expect(400)
      .expect( res => {
        expect(res.body.name).toBe('ValidationError');
      })
      .end((err) => {
        if(err) {
          return done(err);
        }
        Todo.find().then(todos => {
          expect(todos.length).toBe(todos.length);
          done();
        }).catch(e => done(e));
      })
  })
})

describe('GET /todos', () => {
  it('should get all todos', (done) => {
    request(app)
      .get('/todos')
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toBe(todos.length);
      })
      .end(done);
  });
});

describe('GET /todos/:id', () => {
  it('should get todo back', done => {
    request(app).get(`/todos/${todos[0]._id.toHexString()}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(todos[0].text)
      })
      .end(done);
  })

  it('should return 404 for object not found', done => {
    const originalID = todos[0]._id.toHexString();
    var notFoundID = originalID.slice(0, -1) + '0';
    expect(ObjectID.isValid(notFoundID)).toBe(true);
    expect(notFoundID).not.toBe(originalID);

    request(app).get(`/todos/${notFoundID}`)
      .expect(404)
      .end(done);
  })

  it('should return 404 for an invalid object', done => {
    request(app).get(`/todos/${123}`)
      .expect(404)
      .end(done);
  })
})

describe('DELETE /todos/:id', () => {
  it('should delete todo and get it back', done => {
    const prevLength = todos.length;
    request(app).delete(`/todos/${todos[0]._id.toHexString()}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(todos[0].text)
      })
      .end(err => {
        if (err) return done(err);
        Todo.find().then(todos => {
          expect(todos.length).toBe(1);
          done();
        }).catch(err => done(err));
        
      });

  })

  it('should return 404 for object not found', done => {
    const originalID = todos[0]._id.toHexString();
    var notFoundID = new ObjectID();
    expect(ObjectID.isValid(notFoundID)).toBe(true);
    expect(notFoundID).not.toBe(originalID);

    request(app).delete(`/todos/${notFoundID}`)
      .expect(404)
      .end(done);
  })

  it('should return 404 for an invalid object', done => {
    request(app).delete(`/todos/${123}`)
      .expect(404)
      .end(done);
  })
})

describe('PATCH /todos/:id', () => {
  it('should update todo and get it back', done => {
    request(app).patch(`/todos/${todos[0]._id.toHexString()}`)
      .send({ text: "changed", completed: true})
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe("changed")
        expect(res.body.todo.completed).toBe(true);
        expect(typeof res.body.todo.completedAt === "number").toBeTruthy();
      })
      .end(done);
  })

  it('should clear compeltedAt when todo is not completed', done => {
    request(app).patch(`/todos/${todos[1]._id.toHexString()}`)
    .send({ text: "changed 2", completed: false})
    .expect(200)
    .expect((res) => {
      expect(res.body.todo.text).toBe("changed 2")
      expect(res.body.todo.completed).toBe(false);
      expect(res.body.todo.compeltedAt).not.toBeTruthy();
    })
    .end(done);
  })
})

describe('GET /users/me', () => {
  it('should return user if authenticated', done => {
    request(app)
      .get('/users/me')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect(res => {
        expect(res.body._id).toBe(users[0]._id.toHexString());
        expect(res.body.email).toBe(users[0].email);
      })
      .end(done);
  });
  it('should return 401 if not authenticated', done => {
    request(app)
    .get('/users/me')
    .expect(401)
    .expect(res => {
      expect(res.body).toEqual({});
    })
    .end(done);
  })
})

describe('POST /users', () => {
  it('should create a user', done => {
    var email = 'example@example.com';
    var password = '123mnv!';

    request(app)
      .post('/users')
      .send({ email, password })
      .expect(200)
      .expect(res => {
        expect(res.headers['x-auth']).toEqual(expect.anything());
        expect(res.body._id).toEqual(expect.anything());
        expect(res.body.email).toBe(email);
      })
      .end(err => {
        if (err) return done(err);

        User.findOne({email}).then(user => {
          expect(user).toEqual(expect.anything());
          expect(user.password).not.toBe(password);
          done();
        })
      });
  });

  it('should return validation errors if request invalid', done => {
    request(app)
      .post('/users')
      .send({ email: 'abc', password: '123' })
      .expect(400)      
      .end(done)
  })

  it('should not create user if email in use', done => {
    request(app)
      .post('/users')
      .send({ email: users[0].email, password: users[0].password })
      .expect(400)
      .end(done)
  })
})