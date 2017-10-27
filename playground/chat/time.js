const moment = require('moment');
// Jan 1st 1970 as utc
// console.log(new Date().getMonth());

var date = moment();
date.add(100, 'year');

console.log(date.format('MMM Do YYYY'));

var date2 = moment();
// 10:35 am
console.log(date2.format('h:mm a'));
