const router = require('express').Router();
const bcrypt = require('bcryptjs');
const User = require('../users/users-model');
const { checkRegistered, checkLogin } = require('./auth-middleware');
const secret = require('../secrets/secret')
const jwt = require('jsonwebtoken')

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

router.post('/register', checkRegistered, async (req, res, next) => {
  const { username, password } = req.body;
  const hash = bcrypt.hashSync(password, 8);
  const user = { username, password: hash };
  try {
    const newUser = await User.add(user);
    res.status(201).json(newUser);
  } catch (err) {
    next(err);
  };
});

router.post('/login', checkLogin, (req, res, next) => {
  const user = req.user
  const { password } = req.body
  const validCreds = bcrypt.compareSync(password, user.password)

  const generateToken = user => {
    const payload = {
      subject: user.id,
      username: user.username,
    }
    const options = {
      expiresIn: '1d'
    }
    return jwt.sign(payload, secret, options)
  }

  if (validCreds) {
    res.status(200).json({
      message: `welcome, ${user.username}`,
      token: generateToken(user)
    })
  } else {
    next({ status: 401, message: 'invalid credentials' })
  }
});

module.exports = router;