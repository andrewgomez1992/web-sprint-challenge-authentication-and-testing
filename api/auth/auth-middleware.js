const User = require('../users/users-model')

const checkUserNameUnique = async (req, res, next) => {
    const { username } = req.body
    const user = await User.getByUserName(username)
    console.log(user)
    if (user) {
        next({ status: 401, message: 'username taken' })
    } else {
        next()
    }
}

// const checkUserNameExists = async (req, res, next) => {

// }

module.exports = {
    checkUserNameUnique
}