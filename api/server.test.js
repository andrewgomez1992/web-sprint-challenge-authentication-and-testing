const server = require('./server');
const request = require('supertest');
const db = require('../data/dbConfig');

const userA = { username: 'foo', password: 'bar' };

beforeAll(async () => {
  await db.migrate.rollback();
  await db.migrate.latest();
});

afterAll(async () => {
  await db.destroy();
});

test('sanity', () => {
  expect(true).not.toBe(false);
});

describe('server', () => {
  describe('[POST] /api/auth/register', () => {
    beforeEach(async () => {
      await db('users').truncate();
    });
    it('adds a new user with bcrypted password on success', async () => {
      await request(server).post('/api/auth/register').send(userA);
      const user = await db('users').first();
      expect(user).toHaveProperty('id');
      expect(user).toHaveProperty('username');
      expect(user).toHaveProperty('password');
    });
  });
});

describe('POST /auth/register', () => {
  test('if password is missing', async () => {
    let res = await request(server).post('/api/auth/register').send({ username: 'drewgomez' });
    expect(res.body.message).toBe("username and password required");
  });
  test('if username is missing', async () => {
    let res = await request(server).post('/api/auth/register').send({ password: '12345' });
    expect(res.body.message).toBe("username and password required");
  });
  test('if user or password is incorrect', async () => {
    let res = await request(server).post('/api/auth/register').send({ username: 'drewgomez', password: '12345' });
    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('username');
    expect(res.body).toHaveProperty('username');
  });
});

describe('POST /auth/login', () => {
  test('if username or password is missing, response body includes "username and password required"', async () => {
    let res = await request(server).post('/api/auth/login').send({ password: 'password' });
    expect(res.body.message).toBe("username and password required");
  });
  test('if username does not exist, response body includes "invalid credentials"', async () => {
    let res = await request(server).post('/api/auth/login').send({ username: "jondoe", password: "doejon" });
    expect(res.body.message).toBe("invalid credentials");
  });
  test('if password is incorrect, response body includes "invalid credentials"', async () => {
    let res = await request(server).post('/api/auth/login').send({ username: 'drew', password: 'correct' });
    await request(server).post('/api/auth/login').send({ username: 'drew', password: 'incorrect' });
    expect(res.body.message).toBe('invalid credentials');
  });
});

describe('GET /jokes', () => {
  test('if token is missing, response body includes "token required"', async () => {
    const res = await request(server).get('/api/jokes');
    expect(res.body.message).toBe("token required");
  });
  test('if token is invalid, response body includes "token invalid"', async () => {
    const jokesRes = await request(server).get('/api/jokes').set('Authorization', "fakeToken");
    expect(jokesRes.body.message).toBe("token invalid");
  });
  test('if proper JWT token included, returns an array of jokes', async () => {
    await request(server).post('/api/auth/register').send({ username: "validuser", password: "correct" });
    const res = await request(server).post('/api/auth/login').send({ username: "validuser", password: "correct" });
    const { token } = res.body;
    const jokesRes = await request(server).get('/api/jokes').set('Authorization', token);
    expect(jokesRes.body).toHaveLength(3);
  });
});


