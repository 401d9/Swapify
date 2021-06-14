'use strict';
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('./models/users-model.js');
const basicAuth = require('./middleware/basic.js');
const bearerAuth = require('./middleware/bearer.js');
const Dashboard = require('./models/dashboard-model.js');

router.get('/', (req, res) => {
  res.render('pages/home');
});


router.get('/signup', (req, res) => {
  res.render('pages/register');
});

router.post('/signup', async (req, res, next) => {
  try {
    let user = new User(req.body);
    const userRecord = await user.save();
    const output = {
      user: userRecord,
      token: userRecord.token,
    };
    if (output.user.rate.length === 0) {
      res.status(201).json(output);
      // res.status(201).redirect('/profile');
    }
    if (output.user.rate.length > 0) {
      let average = (array) => array.reduce((a, b) => a + b) / array.length;
      userRecord.rate = Math.round(average(userRecord.rate) * 10) / 10;
      res.status(201).json(output);
      // res.status(201).redirect('/profile');
    }
  } catch (e) {
    next(e.message);
  }
});

router.get('/signin', (req, res) => {
  res.render('pages/signin');
});

router.post('/signin', basicAuth, (req, res, next) => {
  const user = {
    user: req.user,
    token: req.user.token,

  };
  res.status(200).json(user);
  // res.status(200).redirect('/profile');
});
router.get('/profile', (req, res) => {
  res.render('pages/profile');
});

router.get('/users', bearerAuth, async (req, res, next) => {
  //all users
  const users = await User.find({});
  const list = users.map(user => user.username);
  res.status(200).json(list);

  //one user
  // await res.status(200).json({user : req.user.username}); 

});

router.get('/addToDashboard', async (req, res, next) => {
  try {
    let dashboard = new Dashboard(req.body);
    const dashboardRecord = await dashboard.save();
    res.status(201).json(dashboardRecord);

  } catch (e) {
    next(e.message);
  }
});
router.get('/dashboard', async (req, res, next) => {
  //dashboard
  const dashboard = await Dashboard.find({});
  res.status(200).json(dashboard);

});

router.get('/secret', bearerAuth, async (req, res, next) => {
  res.status(200).send('Welcome to the secret area');
});


module.exports = router;

