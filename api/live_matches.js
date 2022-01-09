const axios = require('axios')
const db_module = require('../database/database_module')
const append_info_helper = require('./helpers/append_team_info')

exports.get_live_matches = async function() {
    const plan_param = 'TIER_ONE'
    const status_param = 'LIVE'
    const config = {
        method: 'get',
        url: process.env.API_BASE_URL + '/v2/matches',
        headers: {'X-Auth-Token': process.env.API_AUTH_TOKEN},
        params: {plan: plan_param, status: status_param}
    }

    try {
        const teams = await db_module.get_teams()
        const all_teams = JSON.stringify({teams})
        let api_response = await axios(config)
        let code = api_response.status
        const api_response_body = api_response.data
        let updated_api_response = await append_info_helper.append_team_info(JSON.stringify({api_response_body}), all_teams)
        let response_body = {'count': api_response.data.count, 'matches': updated_api_response.matches} 
        return {code, response_body}
    } catch(e) {
        console.log(e)
        let code = 500
        let response_body = null
        return {code, response_body}
    }
}