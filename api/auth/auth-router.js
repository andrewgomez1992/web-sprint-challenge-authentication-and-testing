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
  User.getAll()
    .then(result => {
      let user = '';
      for (let i = 0; i < result.length; i++) {
        if (result[i].username === req.body.username
          && bcrypt.compareSync(req.body.password, result[i].password)) {
          user = result[i];
        };
      };

      if (!user || user.username !== req.body.username) {
        res.status(404).json({ message: 'invalid credentials' });
        return;
      } else {
        const token = generateToken(user);
        res.status(200).json({ message: `welcome, ${user.username}`, token });
      };
    });
});

module.exports = router;