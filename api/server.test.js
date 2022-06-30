const server = require('./server')
const request = require('supertest')
const bcrypt = require('bcryptjs')
const token = require('../api/auth/token')
const jwt = require('jsonwebtoken')

const db = require('../data/dbConfig');

const userA = { username: 'foo', password: 'bar' };

beforeAll(async () => { // runs before everything
  await db.migrate.rollback();
  await db.migrate.latest();
})

afterAll(async () => {
  await db.destroy(); // only use destroy when doing tests
})

test('sanity', () => {
  expect(true).not.toBe(false);
})

describe('server', () => {
  describe('[POST] /api/auth/register', () => {
    beforeEach(async () => {
      await db('users').truncate();
    })
    it('adds a new user with bcrypted password on success', async () => {
      await request(server).post('/api/auth/register').send(userA);
      const user = await db('users').first();
      expect(user).toHaveProperty('id');
      expect(user).toHaveProperty('username');
      expect(user).toHaveProperty('password');
    })
  })
})

describe('GET /jokes', () => {
  test('if token missing from Authorization header, response body includes "token required"', async () => {
    const res = await request(server).get('/api/jokes')
    expect(res.body.message).toBe("token required")
  })
  test('if JWT token invalid, response body includes "token invalid"', async () => {
    const jokesRes = await request(server).get('/api/jokes').set('Authorization', "totallybogustoken")
    expect(jokesRes.body.message).toBe("token invalid")
  })
  test('if proper JWT token included, returns an array of jokes', async () => {
    await request(server).post('/api/auth/register').send({ username: "validuser", password: "RIGHTPASSWORD" })
    const res = await request(server).post('/api/auth/login').send({ username: "validuser", password: "RIGHTPASSWORD" })
    const { token } = res.body
    const jokesRes = await request(server).get('/api/jokes').set('Authorization', token)
    expect(jokesRes.body).toBeInstanceOf(Array)
    expect(jokesRes.body).toHaveLength(3)
  })
})


