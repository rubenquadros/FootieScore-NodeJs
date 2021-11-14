const db_module = require('../database/database_module')

exports.login = async function(id, name, email, profile_pic) {
    return await db_module.save_user(id, name, email, profile_pic)
}