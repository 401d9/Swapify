// 'use strict';

// const express = require('express');
// const app = express();
// const google = express.Router();
// const cors = require('cors');
// const bodyParser = require('body-parser');
// const passport = require('passport');
// require('./google-passport-setup');
// app.use(cors());
// const UserModel = require('../models/users-model');


// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());


// const isLoggedIn = (req, res, next) => {
//   if (req.user) {
//     next();
//   }
//   else {
//     res.sendStatus(401);
//   }

// };



// // google.get('/', (req, res) => {
// //   res.send('Welcome to home page');
// // });

// google.get('/failed', (req, res) => {
//   res.send('You failed to login :( ');
// });
// google.get('/good', isLoggedIn, async (req, res) => {
//   // res.send(req.user);
//   // res.send(`Welcome ${req.user.displayName}`);

//   const username = req.user.emails[0].value;
//   const password = '1234';
//   let obj = {
//     username: username,
//     password: password,
//     descriptionOfUser: 'X user description X',
//     experience: 'X experience X',
//     service: 'X service X',
//     name: 'X name X',
//     email: 'X email X'
//   };
//   try {
//     const test = UserModel.findOne(obj.username)
//     if (test) {
//       res.send(req.user);
//     }
//     else {
//       const record = new UserModel(obj);
//       const savedRecord = await record.save();
//       res.send(req.user);

//     }

//   }
//   catch (e) { console.log(e) }
// });

// google.get('/google',
//   passport.authenticate('google', { scope: ['profile', 'email'] }));

// google.get('/google/callback',
//   passport.authenticate('google', { failureRedirect: '/failed' }),
//   function (req, res) {
//     // Successful authentication, redirect home.
//     res.redirect('/good');
//   });

// // google.get('/logout', (req, res) => {
// //   req.session = null;
// //   req.logOut();
// //   res.redirect('/');
// // });




// module.exports = google;

