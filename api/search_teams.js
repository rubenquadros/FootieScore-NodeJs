const algolia_module = require('../algolia/algolia_module')

exports.search_teams = async function(search_query) {
    return await algolia_module.search_teams(search_query)
}
