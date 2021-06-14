const { createServer } = require('http');
const { Server } = require('socket.io');
const Client = require('socket.io-client');
const faker = require('faker');
const formatMessage = require('../src/models/messages.js');
const {userJoin, getCurrentUser, userLeave, getRoomUsers} = require('../src/models/users.js');
let id;
const {expect} = require('@jest/globals');
describe('Socket', () => {
  let io, serverSocket, clientSocket;

  beforeAll((done) => {
    const httpServer = createServer();
    io = new Server(httpServer);
    httpServer.listen(() => {
      const port = httpServer.address().port;
      clientSocket = new Client(`http://localhost:${port}`);
      io.on('connection', (socket) => {
        serverSocket = socket;
      });
      clientSocket.on('connect', done);
    });
  });

  afterAll(() => {
    io.close();
    clientSocket.close();
  });

  it('should `joinRome` event work', (done) => {
    clientSocket.on('joinRoom', (chat) => {
      expect(chat.username).toBe(username);
      expect(chat.room).toBe(room);
      done();
    });
    let username = 'Test';
    let room = 625156;
    serverSocket.emit('joinRoom', ({username: username, room:room}));
  });

  it('should create user', (done) => {
    clientSocket.on('joinRoom', (chat) => {
      const user = userJoin(clientSocket.id, chat.username, chat.room);
      id = user.id;
      expect(user.id).toBe(clientSocket.id);
      expect(user.username).toBe(username);//we sent username as an username
      expect(user.room).toBe(room);
      done();
    });
    let username = 'Test';
    let room = 625156;
    serverSocket.emit('joinRoom', ({username: username, room:room}));
  });

  it('should create message', (done) => {
    serverSocket.on('message', (chat) => {
      expect(chat).toStrictEqual(formatMessage(username, 'Hi'));
      done();
    });
    let username = 625156;
    clientSocket.emit('message', formatMessage(username, 'Hi'));
  });

  it('should get current user', (done) => {
    clientSocket.on('joinRoom', (chat) => {
      const user = userJoin(clientSocket.id, chat.username, chat.room);
      expect(getCurrentUser(clientSocket.id)).toStrictEqual(user);
      done();
    });
    let username = 'Test';
    let room = 625156;
    serverSocket.emit('joinRoom', ({username: username, room:room}));
  });

  it('should get room users', (done) => {
    clientSocket.on('joinRoom', (chat) => {
      const user = userJoin(clientSocket.id, chat.username, chat.room);
      expect(getRoomUsers(chat.room)).toBeTruthy();
      done();
    });
    let username = 'Test';
    let room = 625156;
    serverSocket.emit('joinRoom', ({username: username, room:room}));
  });

  it('should remove user from room when user leave', () => {
    expect(userLeave(id)).toBeTruthy();
  }); 


  it('should work (with ack)', (done) => {
    serverSocket.on('hi', (cb) => {
      cb('hola');
    });
    clientSocket.emit('hi', (arg) => {
      expect(arg).toBe('hola');
      done();
    });
  });

  describe('edge cases',() => {
    it('should throw an error when calling user join with invalid data',() => {
      function error(){
        userJoin();
      }
      expect(error).toThrow();
    });

    it('should throw an error when calling get current user with invalid data',() => {
      function error(){
        getCurrentUser();
      }
      expect(error).toThrow();
    });

    it('should throw an error when calling get room users with invalid data',() => {
      function error(){
        getRoomUsers();
      }
      expect(error).toThrow();
    });

    it('should throw an error when calling user join with invalid data',() => {
      function error(){
        userLeave();
      }
      expect(error).toThrow();
    });
  });
});
