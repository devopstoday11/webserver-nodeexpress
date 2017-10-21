const { mongoose } = require('../db/mongoose');
const validator = require('validator');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

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

  // Debug log
  // User.find({}).then(users =>{
  //   console.log("data for query");
  //   console.log("_id:", decoded._id);
  //   console.log("tokens.token", token);
  //   console.log("tokens.access", 'auth');
  //   console.log("decoded", decoded);
  //   console.log("+++++++++++++users in DB++++++++++++++");
  //   console.log(users);
  // });

  return User.findOne({
    '_id': decoded._id,
    'tokens.token': token,
    'tokens.access': 'auth'
  })
}

UserSchema.pre('save', function(next) {
  var user = this;
  if (user.isModified('password')) {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, (err, hash) => {
        user.password = hash;
        next();
      })
    });
  } else {
    next();
  }
});

var User = mongoose.model('User', UserSchema);

module.exports = {User};