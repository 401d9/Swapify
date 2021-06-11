'use strict';

const express = require('express');
const app = express();
const google = express.Router();
const cors = require('cors');
const bodyParser = require('body-parser');
const passport = require('passport');
require('./google-passport-setup');
app.use(cors());


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


const isLoggedIn = (req, res, next) => {
  if (req.user) {
    next();
  }
  else {
    res.sendStatus(401);
  }

};



// google.get('/', (req, res) => {
//   res.send('Welcome to home page');
// });

google.get('/failed', (req, res) => {
  res.send('You failed to login :( ');
});
google.get('/good', isLoggedIn, (req, res) => {
  res.send(req.user);
  // res.send(`Welcome ${req.user.displayName}`);
});

google.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }));

google.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/failed' }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect('/good');
  });

// google.get('/logout', (req, res) => {
//   req.session = null;
//   req.logOut();
//   res.redirect('/');
// });

module.exports = google;