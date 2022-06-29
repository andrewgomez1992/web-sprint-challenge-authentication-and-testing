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

router.post('/login', checkLogin, (req, res, next) => {
  /*
      IMPLEMENT
      You are welcome to build additional middlewares to help with the endpoint's functionality.
      1- In order to log into an existing account the client must provide `username` and `password`:
        {
          "username": "Captain Marvel",
          "password": "foobar"
        }
      2- On SUCCESSFUL login,
        the response body should have `message` and `token`:
        {
          "message": "welcome, Captain Marvel",
          "token": "eyJhbGciOiJIUzI ... ETC ... vUPjZYDSa46Nwz8"
        }
      3- On FAILED login due to `username` or `password` missing from the request body,
        the response body should include a string exactly as follows: "username and password required".
      4- On FAILED login due to `username` not existing in the db, or `password` being incorrect,
        the response body should include a string exactly as follows: "invalid credentials".
    */
  let { username, password } = req.body
  User.getById({ username })
    .then(([user]) => {
      if (user && bcrypt.compareSync(password, user.password)) {
        const token = generateToken(user);
        res.status(200).json({ message: `welcome, ${user.username}`, token })
      } else {
        next({ status: 401, message: 'invalid Credentials' })
      }
    })
    .catch(next)
});

module.exports = router;