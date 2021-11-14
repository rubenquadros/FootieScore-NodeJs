const axios = require('axios')

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
        let api_response = await axios(config)
        let code = api_response.status
        let response_body = {'count': api_response.data.count, 'matches': api_response.data.matches} 
        return {code, response_body}
    } catch(e) {
        console.log(e)
        let code = 500
        let response_body = null
        return {code, response_body}
    }
}