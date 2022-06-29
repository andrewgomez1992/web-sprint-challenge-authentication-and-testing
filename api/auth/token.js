const secret = require('../secrets/secret');
const jwt = require('jsonwebtoken');

function generateToken(user) {
    const payload = {
        subject: user.user_id,
        username: user.username,
    };
    const options = {
        expiresIn: '1d',
    };
    return jwt.sign(payload, secret, options);
}

module.exports = generateToken;