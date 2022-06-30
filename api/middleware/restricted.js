const jwt = require('jsonwebtoken');
const secret = require('../secrets/secret');

module.exports = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    res.status(403).json({ message: 'token required' });
    return;
  } else if (token.split('.').length !== 3
    || !jwt.verify(token, secret)) {
    res.status(401).json({ message: 'token invalid' });
    return;
  } else {
    req.headers.authorization = jwt.verify(token, secret);
    next();
  }
};