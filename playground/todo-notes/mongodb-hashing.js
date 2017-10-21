const {SHA256} = require('crypto-js');
var message = 'I am user number 3';
var hash = SHA256(message).toString();
const bcrypt = require('bcryptjs');

var password = '123abc';

bcrypt.genSalt(10, (err, salt) => {
  bcrypt.hash(password, salt, (err, hash) => {
    console.log(hash)
  }) 
})

var hashedPassword = '$2a$10$hsEYfSxfrFGwmcH2XfmIwed4KWtrNdUqseF1TQm14k2db3z64mRtG';


bcrypt.compare(password, hashedPassword, (err, res) => {
  console.log(res);
})

console.log(message);
console.log(`hash: ${hash}`);
// obfuscate plain text password

var data = {
  id: 4,
}

var token = {
  data,
  hash: SHA256(JSON.stringify(data) + 'somesecret').toString()
}

// salt hash
// unique and changes value

// validtion
var resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString();

// man in middle attack
// token.data.id = 5;
// token.hash = SHA256(JSON.stringify(token.data)).toString()

if (resultHash === token.hash) {
  console.log('data was not changed')
} else {
  console.log('DO NOT TRUST data changed')
}

// JSON web token
const jwt = require('jsonwebtoken');

console.log('----')
var data2 = {
  id: 4,
}

var token2 = jwt.sign(data2, '123abc');
var decoded = jwt.verify(token2, '123abc');
console.log(decoded);


