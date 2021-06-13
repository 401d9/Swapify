'use strict';
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const SECRET = process.env.SECRET;

//user schema 

const messagesSchema = new mongoose.Schema({
  message:{type:String},
});

const dashboardSchema = mongoose.Schema({
  descriptionOfService:{type:String},
});

const notificationsSchema = mongoose.Schema({
  link:{type:String},
});

const users = new mongoose.Schema({
  // email:{type:String,required:true,unique:true},
  name:{type:String},
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  service:{type:String},
  experience:{type:String},
  descriptionOfUser:{type:String},
  messages:[messagesSchema],
  dashboard:[dashboardSchema],
  notifications:[notificationsSchema],
  role:{type:String,required:true,default:'user',enum:['user','admin']},
  //add role here 

});

users.virtual('capabilities').get(function(){
  let acl = {
    user:['read','create','update','delete'],
    admin:['read','create','update','delete'],
  };
  return acl[this.role];
});

//****Basic Auth*****//
users.statics.authenticateBasic = async function (username, password) {
  const user = await this.findOne({ username });
  const valid = await bcrypt.compare(password, user.password);
  if (valid) { return user; }
  throw new Error('Invalid User');
};

users.virtual('token').get(function () {
  let tokenObject = {
    username: this.username,
  };
  return jwt.sign(tokenObject, process.env.SECRET);
});

users.pre('save', async function () {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
});



//BEARER AUTH 
//Nour complete here ^^
users.statics.authenticateWithToken = async function (token) {
  try {
    const parsedToken = jwt.verify(token, process.env.SECRET);
    const user = this.findOne({ username: parsedToken.username });
    if (user) { return user; }
    throw new Error('User Not Found');
  } catch (e) {
    throw new Error(e.message);
  }
};



module.exports = mongoose.model('users', users);


