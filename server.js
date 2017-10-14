const express = require('express');
const hbs = require('hbs');
const fs = require('fs');
const app = express();

// middleware
hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');
app.use(express.static(__dirname + '/public'));

// logging
app.use((req, res, next) => {
  const log = `${new Date().toString()}: ${req.method} ${req.url}`;
  fs.appendFileSync('server.log', log + '\n');
  // next to tell you when middleware is done
  next();
});

// maintenance
app.use((req, res, next) => { 
  res.render('construction.hbs');
})

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

app.get('/bad', (req, res) => {
  res.send({info: 'bad request'});
})

app.listen(3000, () => {
  console.log('Server is up on port 3000')
});

