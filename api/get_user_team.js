const db_module = require('../database/database_module')

exports.get_team_details = async function(id) {
    let response_body = await db_module.get_user_team_details(id)
    if (response_body == null) {
        let code = 500
        return {code, response_body}
    } else {
        let code = 200
        return {code, response_body}
    }
}