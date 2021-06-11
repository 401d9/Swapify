'use strict';

// 3rd Party Resources
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const passport = require('passport'); 
const cookieSession = require('cookie-session'); 





// Esoteric Resources
const errorHandler = require('./error-handlers/500.js');
const notFound = require('./error-handlers/404.js');
const googleAuth = require('./auth/middleware/google-auth');


// Prepare the express app
const app = express();

app.use(cookieSession({ 
  name: 'tuto-session',
  keys: ['key1', 'key2'],
}));

// App Level MW
app.use(cors());
app.use(morgan('dev'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(passport.initialize()); 
app.use(passport.session()); 

// Routes
// app.use();
app.use(googleAuth); 



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
