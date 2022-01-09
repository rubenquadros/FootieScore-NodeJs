const axios = require('axios')
const db_module = require('../database/database_module')
const append_info_helper = require('./helpers/append_team_info')

exports.get_recent_matches = async function(id) {
    const teams = await db_module.get_teams()
    const all_teams = JSON.stringify({teams})
    if (id == -1) {
        //get random team matches
        const team_ids = teams.map(ids => ids.id)
        if (team_ids == null) {
            let code = 500
            let response_body = null
            return {code, response_body}
        } else {
            const team_id = team_ids[Math.floor(Math.random()*team_ids.length)]
            let api_response = await get_recent_matches_internal(team_id)
            if (api_response == null || api_response.status != 200) {
                let code = 500
                let response_body = null
                return {code, response_body}
            } else {
                const api_response_body = api_response.data
                let code = api_response.status
                let response_body = await append_info_helper.append_team_info(JSON.stringify({api_response_body}), all_teams)
                return {code, response_body}
            }
        }
    } else {
        //get fav team matches
        let api_response = await get_recent_matches_internal(id)
        if (api_response == null || api_response.status != 200) {
            let code = 500
            let response_body = null
            return {code, response_body}
        } else {
            const api_response_body = api_response.data
            let code = api_response.status
            let response_body = await append_info_helper.append_team_info(JSON.stringify({api_response_body}), all_teams)
            return {code, response_body}
        }
    }
}

//get recent 2 matches for the team
get_recent_matches_internal = async function(team_id) {
    const plan_param = 'TIER_ONE'
    const status_param = 'FINISHED'
    const limit_param = '2'
    const season_param = new Date().getFullYear()
    const config = {
        method: 'get',
        url: process.env.API_BASE_URL + '/v2/teams/' + team_id + '/matches',
        headers: { 'X-Auth-Token': process.env.API_AUTH_TOKEN },
        params: { plan: plan_param, status:  status_param, limit: limit_param, season: season_param}
    }
    
    try {
        const api_response = await axios(config)
        return api_response
    } catch (e) {
        console.log(e)
        return null
    }
}