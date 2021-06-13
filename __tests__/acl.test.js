'use strict';

process.env.SECRET = 'toes';

const server = require('../src/server.js').server;
const supergoose = require('@code-fellows/supergoose');
const bearer = require('../src/auth/middleware/bearer.js');
const {expect} = require('@jest/globals');
const mockRequest = supergoose(server);

let roles = {
  user:{username:'user',password:'pass'},
  admin:{username:'admin',password:'pass',role:'admin'},
};

describe('access control',() => {
 
  describe('user',() => {
    it('should successfuly create a new user', async () => {
      const res = await mockRequest.post('/signup').send(roles.user);
      const userObject = res.body;

      expect(res.status).toBe(201);
      expect(userObject.token).toBeDefined();
      expect(userObject.user._id).toBeDefined();
      expect(userObject.user.username).toEqual(roles.user.username);
      expect(userObject.user.role).toBe('user');
    });
    it('should successfuly create a new user with role admin', async () => {
      const res = await mockRequest.post('/signup').send(roles.admin);
      const userObject = res.body;

      expect(res.status).toBe(201);
      expect(userObject.token).toBeDefined();
      expect(userObject.user._id).toBeDefined();
      expect(userObject.user.username).toEqual(roles.admin.username);
      expect(userObject.user.role).toBe('admin');
    });

    it('should successfuly signin with basic auth', async () => {
      const res = await mockRequest.post('/signin').auth(roles.user.username,roles.user.password);

      const userObject = res.body;

      expect(res.status).toBe(200);
      expect(userObject.token).toBeDefined();
      expect(userObject.user._id).toBeDefined();
      expect(userObject.user.username).toEqual(roles.user.username);
    });

    it('basic fails with known user and wrong password ', async () => {

      const response = await mockRequest.post('/signin')
        .auth('admin', 'xyz');
      const userObject = response.body;

      expect(response.status).toBe(500);
      expect(userObject.user).not.toBeDefined();
      expect(userObject.token).not.toBeDefined();

    });

    it('basic fails with unknown user', async () => {

      const response = await mockRequest.post('/signin')
        .auth('nobody', 'xyz');
      const userObject = response.body;

      expect(response.status).toBe(500);
      expect(userObject.user).not.toBeDefined();
      expect(userObject.token).not.toBeDefined();

    });
  });
});
