const router = require('express').Router();
const bcrypt = require('bcryptjs');
const User = require('../users/users-model');
const generateToken = require('./token');
const { checkRegistered, checkLogin } = require('./auth-middleware');

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

router.post('/login', checkLogin, (req, res) => {

});

module.exports = router;