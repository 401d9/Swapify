'use strict';

const users = require('../models/users-model.js');

module.exports = async (req, res, next) => {
  if (!req.headers.authorization) {next(' fail to login '); }
  else{
    try {

      const token = req.headers.authorization.split(' ').pop();
      const validUser = await users.authenticateWithToken(token);

      req.user = validUser;
      req.token = validUser.token;
      next();

    } catch (error) {
      res.status(403).send('Access Denied');
    }}
  
};
