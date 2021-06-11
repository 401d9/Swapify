'use strict';

require('dotenv').config();

const server = require('./src/server');

const mongoose = require('mongoose');

const port = process.env.PORT || 4222 ;

mongoose
  .connect(process.env.MONGOOSE_URI,
    { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true })
  .then(() => {
    server.start(port);
  })
  .catch((e) => {
    console.log('🔈 WARNING ✋🔴 THERE IS ⚠️CONNECTION_ERROR⚠️ IN 🚀 ~ file: index.js ~ line 18 ~ e.massage ➡️ ', e.massage);
  });