const mongoose = require('mongoose');

mongoose.Promise = global.Promise; // to use global promises not 3rd party
mongoose.connect(process.env.MONGODB_URI, {useMongoClient: true});

module.exports = {mongoose};