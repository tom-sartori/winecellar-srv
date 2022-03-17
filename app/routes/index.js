const express = require('express')

const router = express.Router()

const appellationRoute = include('routes/appellation.routes')
const CONSTANTS = include('config/constants')

module.exports = app => {
    // Set initial root.
    router.get('/', (request, response) => {
        response.json({ info: "Node.js, Express, and Postgres API. " })
    })

    // Set routes.
    app.use(CONSTANTS.ROOT.API + CONSTANTS.ROOT.MODEL.APPELLATION, appellationRoute(app))

    return router
}
