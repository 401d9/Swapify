'use strict';
require('dotenv').config();
process.env.SECRET = 'SOME-COMPLEX-RANDOMLLY-GNERATED-KEY';
const server = require('../src/server.js').server;
const supergoose = require('@code-fellows/supergoose');
const mockRequest = supergoose(server);
const {expect} = require('@jest/globals');
const jwt = require('jsonwebtoken');

//-----------Testing  Profile routes-----------------// 
describe('Profile routes',() => {
  let id;
  const user={
    username:'Mr.X',
    password:'pass',
    service:'Electrical',
    experience:'15 years',
    descriptionOfUser:'Worked in X company', 
  };
  it('should successfully create a new user in DB and return his/her data', async () => {
    const res = await mockRequest.post('/signup').send(user);
    const userObject = res.body;
    expect(res.status).toBe(201);
    expect(userObject.user.username).toBe(user.username);
    expect(userObject.user.service).toBe(user.service);
    expect(userObject.user.experience).toBe(user.experience);
    expect(userObject.user.descriptionOfUser).toBe(user.descriptionOfUser);
  });
  it('should successfully return get by ID a specific user ', async () => {
      
    const req= {};
    const res={
      status: jest.fn(()=>{
        return res;
      }),
      send: jest.fn(()=>{
        return res;
      }),
    };
  
    const token = jwt.sign(user,process.env.SECRET);
    req.headers={
      authorization:`Bearer ${token}`,
    };
    const bearerResponse = await mockRequest
      .get(`/profile`)
      .set('Authorization', `Bearer ${token}`);
    const userObject2 = bearerResponse.body.user;
    console.log('lllllllllll',bearerResponse )
    expect(bearerResponse.status).toBe(200);
    expect(userObject2.service).toBe(user.service);
  });
  it('should successfully update data profile by specific ID', async () => {
      
    const req= {};
    const res={
      status: jest.fn(()=>{
        return res;
      }),
      send: jest.fn(()=>{
        return res;
      }),
    };
    const updatedUser={
      username:'Mr.Y',
      password:'pass',
      service:'artist',
      experience:'10 years',
      descriptionOfUser:'Worked in Y company',
       
    };
    const token = jwt.sign(user,process.env.SECRET);
    req.headers={
      authorization:`Bearer ${token}`,
    };
    const bearerResponse = await mockRequest
      .put(`/profile`).send(updatedUser )
      .set('Authorization', `Bearer ${token}`);
    const userObject2 = bearerResponse.body;
    expect(bearerResponse.status).toBe(200);
    expect(userObject2.service).toBe(updatedUser.service);
  });

});

describe('API server', () => {
  it('should get 404 status wrong route', async () => {
    const response = await mockRequest.get('/jhu');
    expect(response.status).toBe(404);
  });
  it('should get 200 status for  / route', async () => {
    const response = await mockRequest.get('/');
    expect(response.status).toBe(200);
  });
  it('should get 200 status for /signup route', async () => {
    const response = await mockRequest.get('/signup');
    expect(response.status).toBe(200);
  });
  it('should get 200 status for /signin route', async () => {
    const response = await mockRequest.get('/signin');
    expect(response.status).toBe(200);
  });

});

describe('Route /chat', () => {
  it('pass', async () => {

    const res = await mockRequest.get('/chat');

    expect(res.status).toBe(200);
    
  });

});

