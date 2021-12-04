const algoliasearch = require('algoliasearch')

const app_id = process.env.ALGOLIA_APP_ID
const api_key = process.env.ALGOLIA_API_KEY

const client = algoliasearch(app_id, api_key)

exports.search_teams = async function(search_query) {
    const index = client.initIndex('teams')

    return await index.search(search_query)
}