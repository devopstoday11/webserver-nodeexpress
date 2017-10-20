const {SHA256} = require('crypto-js');
var message = 'I am user number 3';
var hash = SHA256(message).toString();

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


