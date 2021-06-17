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
    expect(userObject.username).toBe(user.username);
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

describe('Route /notifications', () => {

  let id;
  const user={
    _id:'60ca1a8e6c1d4911ed7a8773',
    username:'Mr.X44',
    password:'pass',
    service:'Electrical',
    experience:'15 years',
    descriptionOfUser:'Worked in X company', 
    notifications:[ {
      "_id": "60ca106e63314a05430c6604",
      "username": "Lee Crist",
      "time": "5:53 pm",
      "link": "http://localhost:4222/private?id=Lee+Crist&askerId=Shady&room=3784"
  },
  {
      "_id": "60ca108a63314a05430c6606",
      "time": "5:54 pm",
      "link": "http://localhost:4222/private?id=Lee+Crist&askerId=Shady&room=3784"
  }]
  };

  it('should successfully create a new user in DB and return his/her data', async () => {
    const res = await mockRequest.post('/signup').send(user);
    const userObject = res.body;
    expect(res.status).toBe(201);
    //id = userObject.user._id;
  });

  it('pass happy case', async () => {

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
      .get(`/notifications`)
      .set('Authorization', `Bearer ${token}`);

    const userObject2 = bearerResponse.body;
    
    expect(bearerResponse.status).toBe(200);

    
  });
  it('pass edge case1', async () => {

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
    .get(`/notifications`)
    .set('Authorization', `Bearer ${token}`);

  expect(bearerResponse.status).toBe(200);
});

  it('pass edge case2', async () => {

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
      .get(`/notifications`)
      .set('Authorization', `Bearer ${token+1}`);

    expect(bearerResponse.status).toBe(403);
  });
  it('pass add notify', async () => {

    const res = await mockRequest.get(`/private?id=Vincent+Harvey&askerId=${id}&room=42832`);

    expect(res.status).toBe(200);
    
  });
  
});

describe('Route /oauth', () => {
  it('pass', async () => {

    const res = await mockRequest.get('/private');

    expect(res.status).toBe(200);
    
  });
});