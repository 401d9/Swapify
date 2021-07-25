"use strict";
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const SECRET = process.env.SECRET;

const messagesSchema = new mongoose.Schema({
  username: { type: String },
  text: { type: String },
  time: { type: String },
});

const dashboardSchema = mongoose.Schema({
  serviceNeeded: { type: String },
  date: { type: String },
  text: { type: String },
});

const notificationsSchema = mongoose.Schema({
  username: { type: String },
  time: { type: String },
  link: { type: String },
});

// const profileSchema= mongoose.Schema({

// });

const users = new mongoose.Schema({
  // email:{type:String,required:true,unique:true},
  username: { type: String, required: true, unique: true },
  rate: { type: [Number] },
  password: { type: String, required: true },
  name: {
    type: String,
    default: "",
  },
  service: {
    type: String,
    default: "",
  },
  experience: {
    type: String,
    default: "",
  },
  descriptionOfUser: {
    type: String,
    default: "",
  },
  messages: [messagesSchema],
  dashboard: [dashboardSchema],
  notifications: [notificationsSchema],
  profilePicture: {
    type: String,
    default: "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png",
  },
  profileCover: {
    type: String,
    default: "https://github.com/401d9/Swapo/blob/main/public/assets/logo.PNG?raw=true",
  },
  known: {
    type: Array,
    default: [],
  },
  email: {
    type: String,
    default: "",
  },

  // userProfile:[profileSchema],
  role: {
    type: String,
    required: true,
    default: "user",
    enum: ["user", "admin", "moderator"],
  },
  //
});

users.virtual("capabilities").get(function () {
  let acl = {
    user: ["read", "create", "update", "delete"],
    admin: ["read", "create", "update", "delete"],
    moderator: ["read"],
  };
  return acl[this.role];
});

//****Basic Auth*****//
users.statics.authenticateBasic = async function (username, password) {
  console.log('username_backend', username, password);
  const user = await this.findOne({ username });
  const valid = await bcrypt.compare(password, user.password);
  if (valid) {
    return user;
  }
  throw new Error("Invalid User");
};

users.virtual("token").get(function () {
  let tokenObject = {
    username: this.username,
    id: this.id,
  };
  return jwt.sign(tokenObject, process.env.SECRET);
});

users.pre("save", async function () {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
});

//BEARER AUTH
//Nour complete here ^^
users.statics.authenticateWithToken = async function (token) {
  try {
    const parsedToken = jwt.verify(token, process.env.SECRET);
    const user = this.findOne({ username: parsedToken.username });
    if (user) {
      return user;
    }
  } catch (e) {
    throw new Error(e.message);
  }
};

module.exports = mongoose.model("users", users);
