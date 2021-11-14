const db_module = require('../database/database_module')
const axios = require('axios')

exports.get_all_competitions = async function() {
    let db_response = await db_module.get_all_competitions()
    if (db_response.response_body.length > 0) {
        let code = db_response.code
        let response_body = db_response.response_body
        return {code, response_body}
    } else {
        const plan_param = 'TIER_ONE'
        const config = {
            method: 'get',
            url: process.env.API_BASE_URL + '/v2/competitions',
            headers: {'X-Auth-Token': process.env.API_AUTH_TOKEN},
            params: {plan: plan_param}
        }
        try {
            let api_response =  await axios(config)
            let code = api_response.status
            var response_body = []
            let competitions = api_response.data.competitions
            if (competitions != null) {
                competitions.forEach(element => {
                    response_body.push({'id': element.id, 'area_id': element.area.id, 'area_name': element.area.name, 'area_crest': element.area.ensignUrl, 'name': element.name, 'code': element.code, 'competition_crest': element.emblemUrl})
                });
            }
            db_module.save_competitions(response_body)
            return {code, response_body}
        } catch (e) {
            console.log(e)
            let code = 500
            let response_body = null
            return {code, response_body}
        }
    }
}