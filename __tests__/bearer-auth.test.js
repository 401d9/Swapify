'use strict';

process.env.SECRET = 'SOME-COMPLEX-RANDOMLLY-GNERATED-KEY';

// require('@code-fellows/supergoose');
const middleware = require('../src/auth/middleware/bearer');
const Users = require('../src/auth/models/users-model');
const {server} = require ('../src/server');
const supergoose =require('@code-fellows/supergoose');
const mockRequest = supergoose(server);
const jwt = require('jsonwebtoken');




let users={
  admin: {
    username: 'admin',
    password:'123',
  },
}; 

beforeAll(async ()=>{
  await new Users(users.admin).save();
});


describe('bearer test',()=>{

  const req= {};
  const res={
    status: jest.fn(()=>{
      return res;
    }),
    send: jest.fn(()=>{
      return res;
    }),
  };
  const next = jest.fn();
  it('it should raise an exception fail to log in if the  req.header.authorization equal null ',()=>{
    req.headers={
      authorization : null,
    };
  
    return middleware (req,res,next).then (()=>{
     
      expect(next).toHaveBeenCalled();
    
    });
  });

});

describe('bearer test',()=>{

  const req= {};
  const res={
    status: jest.fn(()=>{
      return res;
    }),
    send: jest.fn(()=>{
      return res;
    }),
  };

  const next = jest.fn();
 

  describe('user Auth',()=>{
    it('should fail the login for the user admin with an incorrect token',()=>{
      req.headers={
        authorization : 'Bearer wrongToken',
      };
      return middleware (req,res,next).then (()=>{
        expect(next).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(403);  
      });
    });

    it('should login the user admin with an correct token',async()=>{
      const user ={
        username:'admin',
      };
      const token = jwt.sign(user,process.env.SECRET);
      req.headers={
        authorization:`Bearer ${token}`,
      };
      return middleware(req,res,next).then(()=>{
        expect(next).toHaveBeenCalledWith();
      });
    });

  });

});




describe ('user rout with bearer',()=>{

  const req= {};
  const res={
    status: jest.fn(()=>{
      return res;
    }),
    send: jest.fn(()=>{
      return res;
    }),
  };

  it ('should fail to return the user' , async ()=>{
    const bearerResponse = await mockRequest
      .get('/users')
      .set('Authorization', `Bearer foobar`);
    expect(bearerResponse.status).toBe(403);
  });
  it ('should return the user' , async ()=>{
    const user ={
      username:'admin',
    };
    const token = jwt.sign(user,process.env.SECRET);
    req.headers={
      authorization:`Bearer ${token}`,
    };
    const bearerResponse = await mockRequest
      .get('/users')
      .set('Authorization', `Bearer ${token}`);
    expect(bearerResponse.status).toBe(200);
  });
});