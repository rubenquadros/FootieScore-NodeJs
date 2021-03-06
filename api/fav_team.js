const db_module = require('../database/database_module')
const axios = require('axios')

exports.save_team = async function(id, user_id) {
    //check if team already exists
    const fav_team_id = await db_module.get_user_team_id(user_id)
    if (fav_team_id == id) {
        return 403
    }

    //get team details
    const plan_param = 'TIER_ONE'
    const config = {
        method: 'get',
        url: process.env.API_BASE_URL + '/v2/teams/' + id,
        headers: { 'X-Auth-Token': process.env.API_AUTH_TOKEN },
        params: { plan: plan_param }
    }
    try {
        const api_response = await axios(config)
        if (api_response.status != 200) {
            return api_response.status
        } else {
            //save team
            return await db_module.save_team(id, user_id, api_response.data.website, api_response.data.area.name, api_response.data.name, api_response.data.crestUrl, api_response.data.shortName, api_response.data.tla, api_response.data.area.id)
        }
    } catch (e) {
        console.log(e)
        return 500
    }
}