'use strict';
require('dotenv').config();
process.env.SECRET = 'toes';
process.env.SECRET = 'SOME-COMPLEX-RANDOMLLY-GNERATED-KEY';
const server = require('../src/server.js').server;
const supergoose = require('@code-fellows/supergoose');
const request = supergoose(server);
const { expect } = require('@jest/globals');
const mockRequest = supergoose(server);
const jwt = require('jsonwebtoken');
const faker = require('faker');



let users = {

  x: {
    username: 'Mr.X',
    rate: [4, 5, 2, 3],
    password: 'pass',
    service: 'Electrical',
    experience: '15 years',
    descriptionOfUser: 'Worked in X company',
    messages: [
      { username: 'Mustafa', text: 'Hi shady!', time: '11:28 pm' },
      { username: 'Mustafa', text: 'I want to ask about your service ?', time: '11:28 pm' },
      { username: 'Shady', text: 'Yes!', time: '11:28 pm' },
    ],
  },
  y: {
    username: 'Mr.Y',
    rate: [2, 2, 4, 3],
    password: 'pass',
    service: 'Teaching',
    experience: '1.5 years',
    descriptionOfUser: 'Worked in Y schools',
    notifications: [{ link: 'http://localhost:4747/private?id=Shady&askerId=Ian+Gorczany&room=1745' }],
    role: 'admin',
  },
};


let dashboard = [
  {
    serviceNeeded: faker.name.jobTitle(),
    username: faker.name.firstName(),
    name: faker.name.findName(),
    date: faker.date.future(),
    text: faker.lorem.sentences(),
  },
  {
    serviceNeeded: faker.name.jobTitle(),
    username: faker.name.firstName(),
    name: faker.name.findName(),
    date: faker.date.future(),
    text: faker.lorem.sentences(),
  },
];


describe('\=========================== " HAPPY PATH :) " ===========================/', () => {

  describe('DB', () => {

    describe('user X', () => {
      it('should successfully create a new user in DB and return his/her data', async () => {
        const res = await mockRequest.post('/signup').send(users.x);
        const userObject = res.body;
        console.log('userObject', userObject, 'line69');
        expect(res.status).toBe(201);
        expect(userObject.username).toBe(users.x.username);
      });
    });
    describe('user Y', () => {
      it('should successfully create a new user in DB and return his/her data', async () => {
        const res = await mockRequest.post('/signup').send(users.y);
        const userObject = res.body;

        expect(res.status).toBe(201);
        expect(userObject.username).toBe(users.y.username);

      });
    });
    describe('all users', () => {
      it('should successfully return all users', async () => {
        const req = {};
        const res = {
          status: jest.fn(() => {
            return res;
          }),
          send: jest.fn(() => {
            return res;
          }),
        };
        const user = {
          username: 'Mr.X',
        };
        const token = jwt.sign(user, process.env.SECRET);
        req.headers = {
          authorization: `Bearer ${token}`,
        };
        const bearerResponse = await mockRequest
          .get('/users')
          .set('Authorization', `Bearer ${token}`);

        const userObject2 = bearerResponse.body;

        expect(bearerResponse.status).toBe(200);
        expect(userObject2.length).toBe(2);
      });
    });
    describe('Messages', () => {
      it('should successfully return the messages', async () => {
        const res = await mockRequest.post('/signin').auth(users.x.username, users.x.password);
        const userObject = res.body;

        expect(res.status).toBe(200);
      });
    });
    describe('notifications', () => {
      it('should successfully return the notifications', async () => {
        const res = await mockRequest.post('/signin').auth(users.y.username, users.y.password);
        const userObject = res.body;

        expect(res.status).toBe(200);
      });
    });

    describe('Add to the Dashboard', () => {
      it('should successfully Add To the dashboard', async () => {

        const req = {};
        const res = {
          status: jest.fn(() => {
            return res;
          }),
          send: jest.fn(() => {
            return res;
          }),
        };
        const user = {
          username: 'Mr.X',
        };
        const token = jwt.sign(user, process.env.SECRET);
        req.headers = {
          authorization: `Bearer ${token}`,
        };
        const bearerResponse = await mockRequest
          .post('/posts')
          .set('Authorization', `Bearer ${token}`).send(dashboard[0]);

        const userObject = bearerResponse.body;

        console.log('aaaaaaa ',userObject);

        expect(bearerResponse.status).toBe(201);
        expect(userObject[0].serviceNeeded).toBe(dashboard[0].serviceNeeded);
        expect(userObject[0].username).toBe(dashboard[0].username);
        expect(userObject[0].name).toBe(dashboard[0].name);
        expect(userObject[0].text).toBe(dashboard[0].text);
      });
    });

    describe('Add multi post to the Dashboard', () => {

      const req = {};
      const res = {
        status: jest.fn(() => {
          return res;
        }),
        send: jest.fn(() => {
          return res;
        }),
      };
      const user = {
        username: 'Mr.X',
      };
      const token = jwt.sign(user, process.env.SECRET);
      req.headers = {
        authorization: `Bearer ${token}`,
      };

      dashboard.forEach((elm) => {
        it('should successfully add to the dashboard', async () => {
          const bearerResponse = await mockRequest
            .post('/posts')
            .set('Authorization', `Bearer ${token}`).send(elm);
          const userObject = bearerResponse.body;

          expect(bearerResponse.status).toBe(201);
          expect(userObject[0].serviceNeeded).toBe(elm.serviceNeeded);
          expect(userObject[0].username).toBe(elm.username);
          expect(userObject[0].name).toBe(elm.name);
          expect(userObject[0].text).toBe(elm.text);
        });
      });
    });

    // console.log(dashboard)
    it('should successfully return the dashboard', async () => {

      const res = await mockRequest.get('/dashboard');
      const userObject = res.body;
        
      // console.log(userObject)
      expect(res.status).toBe(200);
      expect(userObject.length).toBe(3);
    });
  });
});





describe('\=========================== " EDGE CASES :( " ===========================/', () => {

  let users2 = {

    x: {
      username: 'Mr.X',
      password: 'pass',
      service: 'Electrical',
      experience: '15 years',
      descriptionOfUser: 'Worked in X company',
    },
    y: {
      password: 'pass',
      service: 'Teaching',
      experience: '1.5 years',
      descriptionOfUser: 'Worked in Y schools',
      role: 'admin',
    },
    z: {
      username: 'Mr.Z',
      password: '',
      service: 'Teaching',
      experience: '1.5 years',
      descriptionOfUser: 'Worked in Y schools',
      role: 'admin',
    },
  };

  it('should not return user data when the username is already used', async () => {
    const res = await mockRequest.post('/signup').send(users2.x);
    expect(res.status).toBe(500);
  });

  it('should not return user data when the user failed to signup ( No username )', async () => {
    const res = await mockRequest.post('/signup').send(users2.y);
    expect(res.status).toBe(500);
  });

  it('should not return user data when the user failed to signup ( No password )', async () => {
    const res = await mockRequest.post('/signup').send(users2.y);
    expect(res.status).toBe(500);
  });


  it(' "forbidden" should not return all users in incorrect token  ', async () => {
    const req = {};
    const res = {
      status: jest.fn(() => {
        return res;
      }),
      send: jest.fn(() => {
        return res;
      }),
    };
    const user = {
      username: 'Mr.X',
    };
    const token = jwt.sign(user, process.env.SECRET);
    req.headers = {
      authorization: `Bearer ${token}`,
    };
    const bearerResponse = await mockRequest
      .get('/users')
      .set('Authorization', `Bearer XX${token}XX`);
  
    const userObject2 = bearerResponse.body;
  
    expect(bearerResponse.status).toBe(403);
    expect(userObject2.length).toBeUndefined;
  });
});