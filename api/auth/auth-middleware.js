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
    const { username, password } = req.body;
    if (!username || !password) {
        res.status(401).json({ message: 'username and password required' })
    }
}

module.exports = { checkRegistered, checkLogin };