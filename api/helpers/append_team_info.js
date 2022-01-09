//add crest_url and short_name for teams
exports.append_team_info = async function(api_response, all_teams) {
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