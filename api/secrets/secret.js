require('dotenv').config()

module.exports = { JWT_SECRET: process.env.JWT_SECRET || 'rome is around here somewhere' }