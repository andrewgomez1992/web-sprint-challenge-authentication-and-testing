const db = require('../../data/dbConfig');

function getAll() {
    return db('users');
}

function getById(user_id) {
    return db('users')
        .where({ id: user_id })
        .first();
}

function add(user) {
    return db('users')
        .insert(user)
        .then(ids => {
            return db('users')
                .where({ id: ids[0] })
                .first();
        });
}

module.exports = { getAll, getById, add };