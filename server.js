const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

// create an Express app
var app = express();

// takes directory that Handlebars should use for partials
hbs.registerPartials(__dirname + '/views/partials');
// for Handlebars engine
app.set('view_engine', 'hbs');

app.use((req, res, next) => {
  // next tells you when your middleware function is done
  // must be included or else other requests in the file will not be run (the webpage will not load)
  var now = new Date().toString();
  var log = `${now}: ${req.method} ${req.url}`;
  console.log(log);
  fs.appendFile('server.log', log + '\n', (err) => {
    if (err) {
      console.log('Unable to append to server.log');
    }
  });
  next();
});

// app.use((req, res, next) => {
//   // stops every action after the middleware since there is no next() call
//   // gives the maintenance page for all pages
//   res.render('maintenance.hbs');
// });

// static adds html pages to the root server automatically
app.use(express.static(__dirname + '/public'));

app.disable('etag');
hbs.registerHelper('getCurrentYear', () => {
  return new Date().getFullYear();
});

hbs.registerHelper('screamIt', (text) => {
  return text.toUpperCase();
});

// '/' stands for root page
// req is request, res is response
app.get('/', (req, res) => {
  // response for the HTTPS request
  //res.send('<h1>Hello Express!</h1>');
  res.render('home.hbs', {
    pageTitle: 'Home Page',
    welcomeMessage: 'Welcome to my website!'
  })
});

// about page is referenced off the root
app.get('/about', (req, res) => {
  // renders any templates
  res.render('about.hbs', {
    // template parameters
    pageTitle: 'About Page',
  });
});

// /bad - send back JSON with errorMessage
app.get('/bad', (req, res) => {
  res.send({
    errorMessage: 'Unable to handle request'
  });
});

// bind app to a port on our machine (3000 is local)
app.listen(3000, () => {
  // function is for doing something once the app successfully connects to the port
  console.log('Server is up on port 3000');
});
