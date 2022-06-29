const User = require('../users/users-model')

const checkUserNameUnique = async (req, res, next) => {
    const { username } = req.body
    const user = await User.getByUserName(username)
    if (user) {
        next({ status: 401, message: 'username taken' })
    } else {
        next()
    }
}

const checkUserBody = (req, res, next) => {
    const { username, password } = req.body
    if (!username || !password) {
        next({ status: 400, message: 'username and password required' })
    }
}

const checkUserNameExists = async (req, res, next) => {
    const { username } = req.body
    const user = await User.getByUserName(username)
    if (user) {
        req.user = user
        next()
    } else {
        next({ status: 401, message: "invalid credentials" })
    }
}

module.exports = {
    checkUserNameUnique,
    checkUserBody,
    checkUserNameExists
}