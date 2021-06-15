'use strict';
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('./models/users-model.js');
const basicAuth = require('./middleware/basic.js');
const bearerAuth=require('./middleware/bearer.js');
const Dashboard=require('./models/dashboard-model.js');
const acl =require('../auth/middleware/acl.js');

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

router.get('/users', bearerAuth, async (req, res, next) => {
  //all users
  const users = await User.find({});
  const list = users.map(user => user.username);
  res.status(200).json(list);

  //one user
  // await res.status(200).json({user : req.user.username}); 

});

router.post('/posts', bearerAuth,async (req, res, next) => {
  console.log('id from posts', req.user.id);
  try {
    let dashboard = new Dashboard(req.body);
    const dashboardRecord = await dashboard.save();
    let id = req.user.id;
    
    const userDashboard = await User.findByIdAndUpdate(id,{$push:{dashboard: {serviceNeeded:req.body.serviceNeeded,date:req.body.date,text:req.body.text}}},{new:true});
    res.status(201).json([dashboardRecord,userDashboard]);

  } catch (e) {
    next(e.message);
  }
});
router.get('/dashboard', async (req, res, next) => {
  //dashboard
  const dashboard = await Dashboard.find({});
  res.status(200).json(dashboard);

});


//******************************************************** */


router.get('/profile', bearerAuth,async(req, res) => {
  
  await res.status(200).json({user : req.user}); 

});

router.put('/profile',bearerAuth,acl('update'), async(req, res) => {
  let id =req.user.id;
  let updateEntry = await User.findByIdAndUpdate(id, req.body,{new:true});
  res.status(200).json(updateEntry);
});

router.delete('/delete',bearerAuth, async (req,res) => {
  let id = req.body.id;
  let deletedObject = await Dashboard.findByIdAndDelete(id);
  res.status(204).json(`the record of this ${id} is deleted successfully `);
});



module.exports = router;

