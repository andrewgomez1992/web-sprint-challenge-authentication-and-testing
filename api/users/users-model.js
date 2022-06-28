const db = require('../../data/dbConfig')

async function add(user) {
    const [id] = await db('users').insert(user)
    return getById(id)
}

async function getById(id) {
    return db('users').where('id', id).first()
}

async function getByUserName(username) {
    return db('users').where({ username }).first()
}

module.exports = {
    add,
    getById,
    getByUserName
}