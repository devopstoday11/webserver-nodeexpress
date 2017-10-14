const express = require('express');
const hbs = require('hbs');

const app = express();
// middleware
app.set('view engine', 'hbs');
app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
  res.render('about.hbs');
});

app.get('/about', (req, res) => {
  res.send('About Page');
});

app.get('/bad', (req, res) => {
  res.send({info: 'bad request'});
})

app.listen(3000, () => {
  console.log('Server is up on port 3000')
});

