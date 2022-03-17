const express = require('express')

const router = express.Router()

const CONSTANTS = include('config/constants')

const appellationRoute = include('routes/bouteille/appellation.routes')
const domaineRoute = include('routes/bouteille/domaine.routes')
const typeVinRoute = include('routes/bouteille/typeVin.routes')

module.exports = app => {
    // Set initial root.
    router.get('/', (request, response) => {
        response.json({ info: "Node.js, Express, and Postgres API. " })
    })

    // Set routes.
    app.use(CONSTANTS.ROOT.API + CONSTANTS.ROOT.OBJECT.BOUTEILLE.APPELLATION, appellationRoute(app))
    app.use(CONSTANTS.ROOT.API + CONSTANTS.ROOT.OBJECT.BOUTEILLE.DOMAINE, domaineRoute(app))
    app.use(CONSTANTS.ROOT.API + CONSTANTS.ROOT.OBJECT.BOUTEILLE.TYPE_VIN, typeVinRoute(app))

    return router
}
