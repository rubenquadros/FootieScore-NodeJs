const pgp = require('pg-promise')()

const connection = {
    user: process.env.DATABASE_USER,
    host: process.env.DATABASE_HOST,
    database: process.env.DATABASE_DB,
    password: process.env.DATABASE_PASSWORD,
    port: process.env.DATABASE_PORT,
    ssl: {
        rejectUnauthorized: false
    }
}
const db = pgp(connection)

exports.save_user = async function(id, name, email, profile_pic) {
    try {
        const text = 'INSERT INTO users (profile_pic, name, id, email) VALUES ($1, $2, $3, $4) ON CONFLICT (id) DO UPDATE SET profile_pic = $1, name = $2, email = $4;'
        const values = [profile_pic, name, id, email]
        await db.none(text, values)
        return 200
    } catch(e) {
        console.log(e)
        return 500
    }
}

exports.save_team = async function(team_id, user_id, website, area_name, name, crest, short_name, initials, area_id) {
    try {
        const text = 'INSERT INTO user_teams (website, area_name, name, crest, short_name, initials, user_id, area_id, id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9);'
        const values = [website, area_name, name, crest, short_name, initials, user_id, area_id, team_id]
        await db.none(text, values)
        return 200
    } catch(e) {
        console.log(e)
        return 500
    }
}

exports.save_competitions = async function(competitions) {
    const cs = new pgp.helpers.ColumnSet(
        ['id', 'area_id', 'area_name', 'area_crest', 'name', 'code', 'competition_crest'],
        { table: 'all_competitions' }
    )
    const insert = pgp.helpers.insert(competitions, cs)
    try {
        db.none(insert)
    } catch(e) {
        console.log(e)
    }
}

exports.get_all_competitions = async function() {
    try {
        const text = 'SELECT * FROM all_competitions;'
        let code = 200
        let response_body = await db.any(text)
        return {code, response_body}
    } catch(e) {
        console.log(e)
        let code = 500
        let response_body = null
        return {code, response_body}
    }
}

exports.get_user_team_id = async function(id) {
    try {
        const text = 'SELECT id as $2:alias FROM user_teams WHERE user_id=$1'
        const values = [id, 'team_id']
        let response_body = await db.any(text, values)
        return response_body
    } catch(e) {
        console.log(e)
        let response_body = null
        return response_body
    }
}