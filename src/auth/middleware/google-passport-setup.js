'use strict';

const passport = require('passport');
let GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.serializeUser(function(user, done) {
  done(null, user);
});
  
passport.deserializeUser(function(user, done) {
  done(null, user);
});

  

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: 'http://localhost:4222/google/callback',
},
function(accessToken, refreshToken, profile, done) {
// check the user is registered in ur db
  return done(null, profile);
},
));
