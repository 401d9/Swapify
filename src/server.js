'use strict';

// 3rd Party Resources
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


// Esoteric Resources
const errorHandler = require('./error-handlers/500.js');
const notFound = require('./error-handlers/404.js');
const googleAuth = require('./auth/middleware/google-auth');
const oauth = require('./auth/middleware/facebook-Oauth');

// Prepare the express app
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const _ = require('underscore');
const formatMessage = require('./models/messages');
const {userJoin, getCurrentUser, userLeave, getRoomUsers } = require('./models/users');
const faker = require('faker');
app.set('view engine','ejs');


app.use(cookieSession({ 
  name: 'tuto-session',
  keys: ['key1', 'key2'],
}));

// App Level MW
app.use(cors());
app.use(morgan('dev'));
app.use(multParse.none());
// app.use(express.static(path.join(__dirname, '/public')));
app.use(express.static('./public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(passport.initialize()); 
app.use(passport.session()); 

// Routes
// app.use();
app.use(googleAuth);
app.use('/',router);


app.get('/chat', function(request, response) {

  let id = faker.name.findName();
  let room = faker.datatype.number();
  console.log('id,room,line71',id,room);
 
  response.render('pages/main',{data:[id, room]});

});

app.get('/private', function(request, response) {


  response.render('pages/chat');

});


//facebook
app.get('/oauth', oauth, (req, res) => {
  res.json({ token: req.token, user: req.user });
});

app.get('/logout', (req, res) => {
  req.session = null;
  req.logOut();
  res.redirect('/');
});

// Catchalls

app.use(notFound);
app.use(errorHandler);



const botName = 'Swapo Bot 🤖';

// Messages queue
let allMessages = [];
//let allMessages = {};

// All online users
let usersArray = [];

// Run when client connects
io.on('connection', socket => {
  socket.on('joinRoom', ({ id, room }) => {
    console.log('line79',id);
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


module.exports = {
  server: http,
  start: (port) => {
    app.listen(port, () => {
      console.log(`🚀 ~ file: server.js ~ line 172 ~ app.listen ~ we are launching 🔥 on port ➡️ ${port}`);
    });
  },
};
