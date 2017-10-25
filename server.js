const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

var app = express();
require('./server/config/config');

// middleware
hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');

// logging
app.use((req, res, next) => {
  const log = `${new Date().toString()}: ${req.method} ${req.url}`;
  fs.appendFileSync('server.log', log + '\n');
  // next to tell you when middleware is done
  next();
});

// MAINTENANCE MODE
// require('./utils/construction.js')(app);

// static 
app.use(express.static(__dirname + '../public'));

// chat app goes here
var server = require('./server/server-chatapp')(app);

hbs.registerHelper('getCurrentYear', () => new Date().getFullYear());
hbs.registerHelper('screamIt', (text) => text.toUpperCase());

app.get('/', (req, res) => {
  res.render('home.hbs', {
    pageTitle: 'Home Page',
    welcomeMessage: 'Welcome to the website',
  });
});

app.get('/about', (req, res) => {
  res.render('about.hbs', {
    pageTitle: 'About Page',
  });
});

app.get('/projects', (req, res) => {
  res.render('projects.hbs', {
    pageTitle: 'Projects Page',
  });
});

app.get('/bad', (req, res) => {
  res.send({info: 'bad request'});
})

require('./server/server-mongo')(app);

server.listen(process.env.PORT, () => {
  console.log(`Server is up on port ${process.env.PORT}`);
});

module.exports = {app}