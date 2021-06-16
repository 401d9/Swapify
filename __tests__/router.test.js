'use strict';
require('dotenv').config();
process.env.SECRET = 'SOME-COMPLEX-RANDOMLLY-GNERATED-KEY';
const server = require('../src/server.js').server;
const supergoose = require('@code-fellows/supergoose');
const mockRequest = supergoose(server);
const {expect} = require('@jest/globals');
const jwt = require('jsonwebtoken');
const users = require('../src/auth/models/users-model.js')



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

  it('should not successfully update data profile by specific ID', async () => {
    
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
      username:'Mr.Z',
      password:'pasdds',
      service:'artist',
      experience:'10 years',
      descriptionOfUser:'Worked in Y company',
    };
    const token = jwt.sign(updatedUser,process.env.SECRET);
    req.headers={
      authorization:`Bearer ${token}`,
    };
    const bearerResponse = await mockRequest
      .put(`/profile`).send(updatedUser )
      .set('Authorization', `Bearer ${token}`);
    const userObject2 = bearerResponse.body;
    expect(bearerResponse.status).toBe(403);
    
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

describe('Route /private', () => {
  it('pass', async () => {

    const res = await mockRequest.get('/private');

    expect(res.status).toBe(200);
    
  });
});

describe('Route /posts', () => {

  let id;
  const user={
    username:'Mr.X',
    password:'pass',
    service:'Electrical',
    experience:'15 years',
    descriptionOfUser:'Worked in X company', 
  };
  const dashboard={
    serviceNeeded:'Electrical',
    username:'Test01',
    name:'Mr. Test',
    date:'date',
    text:'Text',
  };
  it('should successfully create a new user in DB and return his/her data', async () => {
    const res = await mockRequest.post('/signup').send(user);
    const userObject = res.body;
    expect(res.status).toBe(201);
  });
  it('pass', async () => {

    try {
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
      .post(`/posts`).send(dashboard )
      .set('Authorization', `Bearer ${token}`);
    const userObject2 = bearerResponse.body;
    id = userObject2[0]._id;
    expect(bearerResponse.status).toBe(201);
    
    } catch (error) {
      expect(error).toThrow();
    }
    
    
  });
  it('pass', async () => {

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
      .delete(`/delete`).send(id)
      .set('Authorization', `Bearer ${token}`);
    const userObject2 = bearerResponse.body;

    expect(bearerResponse.status).toBe(204);
  });
});
