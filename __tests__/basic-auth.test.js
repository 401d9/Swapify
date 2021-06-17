'use strict';

const supergoose = require('@code-fellows/supergoose');
const middleware = require('../src/auth/middleware/basic.js');

const Users = require('../src/auth/models/users-model.js');


const { server } = require('../src/server.js');
const request = supergoose(server);
const base64 = require('base-64');

let user = {
  username: 'ashar',
  password: '1111',
};


describe('\=========================== " HAPPY PATH :) " ===========================/', ()=>{
  describe('authentication test', () => {

    it('should create a new User on POST /signup', async () => {
      const response = await request.post('/signup').send(user);
      expect(response.status).toEqual(201);
      expect(response.body.username).toEqual('ashar');
    });
  
    it('should Sign In test', async () => {
  
      const user = base64.encode('ashar:1111');
      const response1 = await request.post('/signin').set('Authorization', `Basic ${user}`);
      expect(response1.status).toEqual(200);
      expect(response1.body.username).toEqual('ashar');
    });
  
  });
  
  
})








describe('\=========================== " EDGE CASES :( " ===========================/', ()=>{

  it('should not create a new User on POST /signup when does not send a "username"', async () => {
    let user2 = {
      password: '1111',
    }
    const response = await request.post('/signup').send(user2);
    expect(response.status).toEqual(500);
  });

  it('should not create a new User on POST /signup when does not send a "password"', async () => {
    let user3 = {
      username: 'user',
    }
    const response = await request.post('/signup').send(user3);
    expect(response.status).toEqual(500);
  });

  it('Test wrong password', async () => {
    const response = await request
      .post('/signin')
      .set(
        'Authorization', 'basic ' + new Buffer.from(`${user.username}:${111}`, 'utf8').toString('base64'),
      );
    expect(response.status).toEqual(403);
  });

  it('Test wrong username', async () => {
    const response = await request
      .post('/signin')
      .set(
        'Authorization', 'basic ' + new Buffer.from(`ashar1: ${user.password}`, 'utf8').toString('base64'),
      );
    expect(response.status).toEqual(403);
  });

  it('!req.headers.authorization', async () => {
    const response = await request
      .post('/signin')
      /* .set(
        'Authorization', 'basic ' + new Buffer.from(`ashar1: ${user.password}`, 'utf8').toString('base64'),
      ); */
    expect(response.status).toEqual(403);
  });
})




