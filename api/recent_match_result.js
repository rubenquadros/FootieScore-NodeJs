const axios = require('axios')
const db_module = require('../database/database_module')

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
                let response_body = append_team_info(JSON.stringify({api_response_body}), all_teams)
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
            let response_body = append_team_info(JSON.stringify({api_response_body}), all_teams)
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
    let response = JSON.parse(api_response)['api_response_body']
    const teams = JSON.parse(all_teams)['teams']
    response['matches'].forEach(function(matches) {
        //add home team details
        let home_team_id = matches['homeTeam']['id']
        let home_team_details = teams.filter(function(data) {
            return data.id == home_team_id
        })
        matches['homeTeam']['crest_url'] = home_team_details[0]['crest_url']
        matches['homeTeam']['short_name'] = home_team_details[0]['initials']

        //add away team details
        let away_team_id = matches['awayTeam']['id']
        let away_team_details = teams.filter(function(data) {
            return data.id == away_team_id
        })
        matches['awayTeam']['crest_url'] = away_team_details[0]['crest_url']
        matches['awayTeam']['short_name'] = away_team_details[0]['initials']
    })
    return response
}