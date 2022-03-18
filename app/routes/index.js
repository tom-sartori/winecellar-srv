const express = require('express')

const router = express.Router()

const CONSTANTS = include('config/constants')


const bouteilleRoute = include('routes/bouteille/bouteille.routes')
const appellationRoute = include('routes/bouteille/appellation.routes')
const domaineRoute = include('routes/bouteille/domaine.routes')

const utilisateurRoute = include('routes/utilisateur/utilisateur.routes')


module.exports = app => {
    // Set initial root.
    router.get('/', (request, response) => {
        response.json({ info: "Node.js, Express, and Postgres API. " })
    })

    // Set routes.
    app.use(CONSTANTS.ROOT.API + CONSTANTS.ROOT.OBJECT.BOUTEILLE.BOUTEILLE, bouteilleRoute(app))
    app.use(CONSTANTS.ROOT.API + CONSTANTS.ROOT.OBJECT.BOUTEILLE.APPELLATION, appellationRoute(app))
    app.use(CONSTANTS.ROOT.API + CONSTANTS.ROOT.OBJECT.BOUTEILLE.DOMAINE, domaineRoute(app))

    app.use(CONSTANTS.ROOT.API + CONSTANTS.ROOT.OBJECT.UTILISATEUR.UTILISATEUR, utilisateurRoute(app))


    return router
}
