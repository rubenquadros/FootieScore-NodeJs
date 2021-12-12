const axios = require('axios')
const db_module = require('../database/database_module')

exports.get_recent_matches = async function(id) {
    const db_response = await db_module.get_teams()
    console.log('db_response ' + db_response)
    if (id == -1) {
        //get random team matches
        const team_ids = db_response.map(ids => ids.id)
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
                let code = api_response.status
                let response_body = append_team_info(api_response.data, db_response)
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
            let code = api_response.status
            let response_body = append_team_info(api_response.data, db_response)
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

//add crest_url and short_name for teams
append_team_info = function(api_response, all_teams) {
    let updated_response = api_response
    api_response['matches'].forEach(function(matches, index) {
        //add home team details
        let team_id = matches['homeTeam']['id']
        let team_details = all_teams.find(o => o.id == team_id)
        updated_response['matches'][index]['homTeam']['crest_url'] = team_details['crest_url']
        updated_response['matches'][index]['homeTeam']['short_name'] = team_details['initials']

        //add away team details
        let team_id = matches['awayTeam']['id']
        let team_details = all_teams.find(o => o.id == team_id)
        updated_response['matches'][index]['awayTeam']['crest_url'] = team_details['crest_url']
        updated_response['matches'][index]['awayTeam']['short_name'] = team_details['initials']
    })
    return updated_response
}