require('dotenv')
const jwt = require('jsonwebtoken')
const secret = process.env.SECRET || 'ssh'

const generateToken = (user) => {
    const { id: subject, name } = user;
    const payload = {
        subject, name
    }
    const options = {
        expiresIn: '1d'
    }
    return jwt.sign(payload, secret, options)
}

module.exports = generateToken