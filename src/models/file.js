'use strict';

require('dotenv').config();
const mongoose = require('mongoose');

const users = new mongoose.Schema({
  username:{type:String,required:true,unique:true},
  password:{type:String,required:true},
  role:{type:String,required:true,default:'user',enum:['user','admin']},
});

users.virtual('capabilities').get(function(){
  let acl = {
    user:['read','create','update','delete'],
    admin:['read','create','update','delete'],
  };
  return acl[this.role];
});