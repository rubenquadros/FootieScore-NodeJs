const { response } = require('express')
const db_module = require('../database/database_module')

exports.login = async function(id, name, email, profile_pic) {
    const response_code = await db_module.save_user(id, name, email, profile_pic)
    if (response_code != 200) {
        const response_body = null
        return {response_code, response_body}
    } else {
        const team_id =  await db_module.get_user_team_id(id)
        const response_body = {'user_id': id, 'name': name, 'email':email, 'profile_pic': profile_pic, team_id}
        return {response_code, response_body}
    }
}