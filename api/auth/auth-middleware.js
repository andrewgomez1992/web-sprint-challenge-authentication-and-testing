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

module.exports = {
    checkUserNameUnique
}