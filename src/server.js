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
const io = require('socket.io')(http);
const _ = require('underscore');
const faker = require('faker');

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
  let IID = '60c8cc6b6239a00bb3d9241a';
  let url = new URL('http://localhost:4222/private?');
  url.searchParams.append('id', req.query.id);
  url.searchParams.append('askerId', req.query.askerId);
  url.searchParams.append('room', req.query.room);
  await User.findByIdAndUpdate(IID,{$push: {notifications: {link:url}}},{new:true});
  res.render('pages/chat');

});



//facebook
app.get('/oauth', oauth, (req, res) => {

  res.json({ token: req.token, user: req.user });

});

app.get('/logout', (req, res) => {

  res.clearCookie('tuto-session.sig'); 
  res.clearCookie('token'); 
  res.clearCookie('tuto-session');
  res.redirect('/');

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
io.on('connection', socket => {
  socket.on('joinRoom', ({ id, room }) => {
    //console.log('line79',id);
    const user = userJoin(socket.id, id, room);
    //console.log('119,allMessages.user.username', user.username);
    //let userArrays = user.username;
    //usersArray.push(userArrays);
    //allMessages.userArrays = [];
    socket.join(user.room);
    // Welcome current user
    socket.emit('message', formatMessage(botName, 'Welcome to Swapo!🔄 \n a new world of swapping services!😎'));
    //if (allMessages.length>0){
    if (allMessages.length>0){
      allMessages.forEach((elm)=>{
        console.log(elm);
        //allMessages.userArrays.forEach((elm)=>{
        socket.emit('message', elm);
      });
    }
    // Broadcast when a user connects
    socket.broadcast
      .to(user.room)
      .emit(
        'message',
        formatMessage(botName, `${user.username} is here!🥳`),
      );

    // Send users and room info
    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getRoomUsers(user.room),
    });
  });

  // Listen for chatMessage
  socket.on('chatMessage', msg => {
    const user = getCurrentUser(socket.id);
    //let userArrays = user.username;
    allMessages.push(formatMessage(user.username, msg));
    //allMessages.user.username = [];
    //allMessages.userArrays.push(formatMessage(user.username, msg));
    //console.log(allMessages.userArrays[0]);
    io.to(user.room).emit('message', formatMessage(user.username, msg));
  });

  // Runs when client disconnects
  socket.on('disconnect', () => {
    const user = userLeave(socket.id);

    if (user) {
      io.to(user.room).emit(
        'message',
        formatMessage(botName, `${user.username} has left!😢`),
      );

      // Send users and room info
      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room),
      });
    }
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
      console.log('Click on the link to visit the app. Go to http://' + 'localhost' + ':' + port);
    });
  },
};
