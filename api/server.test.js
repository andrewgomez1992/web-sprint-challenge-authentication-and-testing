const server = require('./server')
const request = require('supertest')
const bcrypt = require('bcryptjs')
const token = require('../api/auth/token')
const jwt = require('jsonwebtoken')

const db = require('../data/dbConfig')

test('sanity', () => {
  expect(true).toBe(true)
})

beforeAll(async () => {
  await db.migrate.rollback()
  await db.migrate.latest()
})

afterAll(async () => {
  await db.destroy()
})


