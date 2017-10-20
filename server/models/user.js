const { mongoose } = require('../db/mongoose');
const validator = require('validator');
const _ = require('lodash');
const jwt = require('jsonwebtoken');

// hashing password and store it
// pword -> 1 way algorithm
// tokens

var UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    minlength: 1,
    trim: true,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email'
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    trim: true
  },
  tokens: [{
    access: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    }
  }]
});

UserSchema.methods.toJSON = function() {
  var user = this;
  var userObj = user.toObject();
  return _.pick(userObj, ['_id', 'email']);
}

UserSchema.methods.generateAuthToken = function() {
  var user = this;
  var access = 'auth';
  var token = jwt.sign({
    _id: user._id.toHexString(), 
    access
  }, 'abc123').toString();

  user.tokens.push({ access, token });
  return user.save().then(() => {
    return token;
  });
}

// statics turns into model method not instance method
UserSchema.statics.findByToken = function(token) {
  const User = this;
  var decoded; // jwt needs to catch

  try {
    decoded = jwt.verify(token, 'abc123');
  } catch(e) {
    return Promise.reject();
  }

  return User.findOne({
    '_id': decoded._id,
    'tokens.token': token,
    'tokens.access': 'auth'
  })
}

var User = mongoose.model('User', UserSchema);

module.exports = {User};