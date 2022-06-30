const jwt = require('jsonwebtoken');
const secret = require('../secrets/secret');

module.exports = (req, res, next) => {
  const token = req.headers.authorization
  if (token) {
    jwt.verify(token, secret, async (err, decoded) => {
      if (err != null) {
        res.status(401).json({ message: 'token invalid' })
        return
      }
      next()
    })
  } else {
    res.status(401).json({ message: 'token required' })
  }
};