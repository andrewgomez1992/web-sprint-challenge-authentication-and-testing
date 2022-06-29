const User = require('../users/users-model');
const generateToken = require('./token');

function checkRegistered(req, res, next) {
    const { username, password } = req.body;
    if (!username || !password) {
        res.status(401).json({ message: 'username and password required' });
        return;
    };
    User.getAll()
        .then(result => {
            if (result.some(x => x.username === req.body.username)) {
                res.status(409).json({ message: 'username taken' });
                return;
            } else {
                next();
            };
        });
};

function checkLogin(req, res, next) {
    let { username, password } = req.body;
    if (!username || !password) {
        res.status(401).json({ message: 'invalid credentials' })
        return;
    } else {
        const token = generateToken(username);
        res.status(200).json({ message: `welcome, ${username}`, token })
    }
}

module.exports = { checkRegistered, checkLogin };