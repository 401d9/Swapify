'use strict';

/*
>---------------------------------------- App Dependencies -----------------------------------------<
*/

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const passport = require('passport'); 
const cookieSession = require('cookie-session'); 
const router =require('./auth/routes.js');
const multer = require('multer');
const multParse = multer();
const methodOverride = require('method-override');
const path = require('path');
const app = express();
const http = require('http').createServer(app);
//const io = require('socket.io')(http);
const _ = require('underscore');
const faker = require('faker');
const moment = require('moment');

/*
>---------------------------------------- Esoteric Resources -----------------------------------------<
*/

const errorHandler = require('./error-handlers/500.js');
const notFound = require('./error-handlers/404.js');
const googleAuth = require('./auth/middleware/google-auth');
const oauth = require('./auth/middleware/facebook-Oauth');
const formatMessage = require('./models/messages');
const bearerAuth=require('./auth/middleware/bearer.js');
const User = require('./auth/models/users-model.js');
const {userJoin, getCurrentUser, userLeave, getRoomUsers } = require('./models/users');
const MessageSchema = require('./auth/models/Message.js');

/*
>---------------------------------------- Server config -----------------------------------------<
*/

//View engine is ejs
app.set('view engine','ejs');

//Specify where the static content is
app.use(express.static('./public'));


app.use(cookieSession({ 
  name: 'tuto-session',
  keys: ['key1', 'key2'],
}));

app.use(cors());
app.use(morgan('dev'));

app.use(multParse.none());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(passport.initialize()); 
app.use(passport.session()); 

/*
>---------------------------------------- Server routing -----------------------------------------<
*/

app.use(googleAuth);

app.use('/',router);

app.get('/chat', function(request, response) {
  // console.log(request.user);
  let id = faker.name.findName();
  let room = faker.datatype.number();

  response.render('pages/main',{data:[id, room]});

});

app.get('/private',  async(req, res) => {
//http://localhost:4222/private?id=Vincent+Harvey&askerId=Vincent+Harvey&room=42832
  let IID;
  if(req.query.askerId === '60ca1a8e6c1d4911ed7a8773'){
    IID = '60ca1a8e6c1d4911ed7a8773';
  } else {
    IID = '60ca5e6a3b503a00152d46e7';
  }
  
  let url = new URL('http://localhost:4222/private?');
  url.searchParams.append('id', req.query.id);
  url.searchParams.append('askerId', req.query.askerId);
  url.searchParams.append('room', req.query.room);
  await User.findByIdAndUpdate(IID,{$push: {notifications: {username:req.query.id,  time: moment().format('h:mm a'), link:url}}},{new:true});
  await User.findByIdAndUpdate(IID,{$push: {messages: {username:req.query.id, text:url, time: moment().format('h:mm a')}}},{new:true});
  res.render('pages/chat');

});



//facebook
app.get('/oauth', oauth, (req, res,next) => {
  try {
    res.status(200).json({ token: req.token, user: req.user });

  } catch (error) {
    next(error.messages);
  }

});

app.get('/logout', (req, res) => {
  try {
    res.clearCookie('tuto-session.sig'); 
    res.clearCookie('token'); 
    res.clearCookie('tuto-session');
    res.redirect('/');
  } catch (error) {
    console.log(error.message);
  }
 

});

// Catchalls
app.use(notFound);
app.use(errorHandler);


/*
>----------------------------------------Socket.IO events-----------------------------------------<
*/

const botName = 'Swapo Bot 🤖';

// Messages queue
let allMessages = [];

// All online users
let usersArray = [];



// Run when client connects
const io = require('socket.io')(http, {
  cors: {
    origin: 'https://swapo-app.netlify.app/',
  },
});

let users = [];
console.log('line 152',users);

const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};

io.on('connection', (socket) => {
  //when ceonnect
  console.log('a user connected.');

  //take userId and socketId from user
  socket.on('addUser', (userId) => {
    addUser(userId, socket.id);
    io.emit('getUsers', users);
  });

  //send and get message
  socket.on('sendMessage', ({ senderId, receiverId, text, conversationId }) => {
    const user = getUser(receiverId);
    console.log('line 180',user);
    if(!user){
      const saveNotification =  async () => {
        const user =  await User.findById(receiverId);
        console.log('user from 184 ', user);
        const senderUser = await User.findById(senderId);
        console.log('senderUser from 186 ', senderUser);
        await user.updateOne({$push:{notifications:`you have a message from ${senderUser.username}`}});
        console.log('hellloooo');
      };
      saveNotification();
    } else {
      io.to(user.socketId).emit('getMessage', {
        senderId,
        text,
      });
    }
  });

  //when disconnect
  socket.on('disconnect', () => {
    console.log('a user disconnected!');
    removeUser(socket.id);
    io.emit('getUsers', users);
  });
});


/*
>---------------------------------------- Export module -----------------------------------------<
*/


module.exports = {
  server: http,
  start: (port) => {
    http.listen(port, () => {
      console.log(`🚀 ~ file: server.js ~ line 191 ~ app.listen ~ we are launching 🔥 on port ➡️ ${port}`);
      console.log('Click on the link to visit the app. Go to http://' + 'localhost' + ':' + port + '||' + http);
    });
  },
};
