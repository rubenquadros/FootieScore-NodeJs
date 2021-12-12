const express = require('express')
const helmet = require('helmet')
const compression = require('compression')
const login_service = require('./api/login')
const competitions_service = require('./api/all_competitions')
const fav_team_service = require('./api/fav_team')
const live_matches_service = require('./api/live_matches')
const search_teams_service = require('./api/search_teams')
const recent_matches_service = require('./api/recent_match_result')

const app = express()
app.use(express.json())
app.use(helmet())
app.use(compression())

const port = process.env.PORT || 3000
const auth_header = 'x-auth-token'

create_server()

function create_server() {

    app.post('/login', async (req, res) => {
        if (!isAuthorized(req.headers[auth_header])) {
            res.status(401).send()
            return
        }
        const response = await login_service.login(req.body.id, req.body.name, req.body.email, req.body.profile_pic)
        res.status(response.response_code).json(response.response_body)
    })

    app.get('/competitions', async (req, res) => {
        if (!isAuthorized(req.headers[auth_header])) {
            res.status(401).send()
            return
        }
        const response = await competitions_service.get_all_competitions()
        if (response.code != 200) {
            res.status(response.code).send()
            return
        } else {
            res.status(response.code).json(response.response_body)
        }
    })

    app.post('/save_team', async (req, res) => {
        if (!isAuthorized(req.headers[auth_header])) {
            res.status(401).send()
            return
        }
        const response = await fav_team_service.save_team(req.body.id, req.body.user_id)
        res.status(response).send()
    })

    app.get('/live_matches', async (req, res) => {
        if (!isAuthorized(req.headers[auth_header])) {
            res.status(401).send()
            return
        }
        const response = await live_matches_service.get_live_matches()
        res.status(response.code).json(response.response_body)
    })

    app.get('/search_teams', async (req, res) => {
        if (!isAuthorized(req.headers[auth_header])) {
            res.status(401).send()
            return
        }
        const response = await search_teams_service.search_teams(req.query.search_query)
        res.json(response)
    })

    app.get('/recent_matches', async(req, res) => {
        if (!isAuthorized(req.headers[auth_header])) {
            res.status(401).send()
            return
        }

        const response = await recent_matches_service.get_recent_matches(req.query.team_id)
        if (response.code != 200) {
            res.status(response.code).send()
            return
        } else {
            res.status(response.code).json(response.response_body)
        }
    })

    app.listen(port, () => {
        console.log('Staring server')
    })
}

function isAuthorized(token) {
    return token == process.env.X_AUTH_TOKEN
}