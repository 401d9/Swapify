'use strict';
// After Login Form 
require('dotenv').config();
const superagent = require('superagent');
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const tokenServerUrl = 'https://graph.facebook.com/v10.0/oauth/access_token';
const remoteAPI = 'https://graph.facebook.com/me';
const User = require('../models/users-model');
// const jwt = require('jsonwebtoken');
// let SECRET = process.env.SECRET;


module.exports = async (req, res, next) => {
  // 2. Users are redirected back to your site by Facebook
  try {
    console.log('<-------:query object:----->', req.query);
    const code = req.query.code;

    console.log('<======== AFTER FORM 1.CODE =========> ', code);
    const remoteToken = await exchangeCodeForToken(code);
   
    console.log('<======= AFTER FORM 2.TOKEN =========>', remoteToken);
    // 3. Use the access token to access the user API
    const remoteUser = await getRemoteUserInfo(remoteToken);

    console.log('<==========: AFTER FORM 3. Facebook USER :========> ', remoteUser);
    const {user, token} = await getUser(remoteUser);

    console.log('after save to db', user, token);
    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    next(error.message);
  }
};

async function exchangeCodeForToken(code) {
  const tokenResponse = await superagent.post(tokenServerUrl).send({
    code: code,
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    redirect_uri: REDIRECT_URI,
    // grant_type: 'authorization_code',
  });
  const accessToken = tokenResponse.body.access_token;
  return accessToken;
}

async function getRemoteUserInfo(token) {
  const userResponse = await superagent.get(remoteAPI)
    .set('Authorization', `Bearer ${token}`)
    .set('Accept', 'application/json');

  const user = userResponse.body;
  console.log('user info provided by Facebook ---->>', user);
  return user;
}

async function getUser(remoteUser) {
  const userRecord = {
    username: remoteUser.name,
    password: 'this_should_be_empty',
  };

  // const userObj = new User(userRecord);
  // const userDoc =await  userObj.save();

  // // const token = userDoc.token;
  // let token = jwt.sign({username: userDoc.username}, SECRET);
  // return [userRecord, token];
 
  const username = userRecord.username;
  const user = await User.findOne({ username });
  if (user) {
    const output = {
      user: user.username,
      token: user.token,
    };
    return output;
  } else {
    const newUser = new User(userRecord);
    const userDoc = await newUser.save();
    const output = {
      user: userDoc,
      token: userDoc.token,
    };
    return output;
  }
}


// async function getUser(remoteUser) {
//   const user = {
//     username: remoteUser.login,
//     password: 'xxxx',
//   };

//   const userObj = new User(user);
//   const userDoc = userObj.save();

//   const token = userDoc.token;
//   return [user, token];
// }