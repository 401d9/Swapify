'use strict';

// 3rd Party Resources
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const passport = require('passport'); 
const cookieSession = require('cookie-session'); 
const router =require('./auth/routes.js');
const multer = require('multer');
const multParse = multer();
const methodOverride = require('method-override');
const path = require('path');


// Esoteric Resources
const errorHandler = require('./error-handlers/500.js');
const notFound = require('./error-handlers/404.js');
const googleAuth = require('./auth/middleware/google-auth');
const oauth = require('./auth/middleware/facebook-Oauth');

// Prepare the express app
const app = express();
app.set('view engine','ejs');


app.use(cookieSession({ 
  name: 'tuto-session',
  keys: ['key1', 'key2'],
}));

// App Level MW
app.use(cors());
app.use(morgan('dev'));
app.use(multParse.none());
// app.use(express.static(path.join(__dirname, '/public')));
app.use(express.static('./public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(passport.initialize()); 
app.use(passport.session()); 

// Routes
// app.use();
app.use(googleAuth);
app.use('/',router);

//facebook
app.get('/oauth', oauth, (req, res) => {
  res.json({ token: req.token, user: req.user });
});

app.get('/logout', (req, res) => {
  req.session = null;
  req.logOut();
  res.redirect('/');
});

// Catchalls

app.use(notFound);
app.use(errorHandler);

module.exports = {
  server: app,
  start: (port) => {
    app.listen(port, () => {
      console.log(`🚀 ~ file: server.js ~ line 34 ~ app.listen ~ we are launching 🔥 on port ➡️ ${port}`);
    });
  },
};
