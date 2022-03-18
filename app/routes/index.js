const express = require('express')

const router = express.Router()

const CONSTANTS = include('config/constants')


const bouteilleRoute = include('routes/bouteille/bouteille.routes')
const appellationRoute = include('routes/bouteille/appellation.routes')
const domaineRoute = include('routes/bouteille/domaine.routes')

const caveRoute = include('routes/cave/cave.routes')
const emplacementRoute = include('routes/cave/emplacement.routes')

const utilisateurRoute = include('routes/utilisateur/utilisateur.routes')


module.exports = app => {
    // Set initial root.
    router.get('/', (request, response) => {
        response.json({ info: "Node.js, Express, and Postgres API. " })
    })

    // Set routes.

    // Bouteille.
    app.use(CONSTANTS.ROOT.API + CONSTANTS.ROOT.OBJECT.BOUTEILLE.BOUTEILLE, bouteilleRoute(app))
    app.use(CONSTANTS.ROOT.API + CONSTANTS.ROOT.OBJECT.BOUTEILLE.APPELLATION, appellationRoute(app))
    app.use(CONSTANTS.ROOT.API + CONSTANTS.ROOT.OBJECT.BOUTEILLE.DOMAINE, domaineRoute(app))

    // Cave.
    app.use(CONSTANTS.ROOT.API + CONSTANTS.ROOT.OBJECT.CAVE.CAVE, caveRoute(app))
    app.use(CONSTANTS.ROOT.API + CONSTANTS.ROOT.OBJECT.CAVE.EMPLACEMENT, emplacementRoute(app))

    // Utilisateur.
    app.use(CONSTANTS.ROOT.API + CONSTANTS.ROOT.OBJECT.UTILISATEUR.UTILISATEUR, utilisateurRoute(app))


    return router
}
