'use strict';

const mongoose = require('mongoose');

const dashboard = new mongoose.Schema({

  serviceNeeded:{type:String},
  username:{type:String},
  name:{type:String},
  date:{type:String},
  text:{type:String},

});

module.exports = mongoose.model('dashboard', dashboard);