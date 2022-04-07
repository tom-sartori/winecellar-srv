const express = require('express')

const router = express.Router()

const CONSTANTS = include('config/constants')


const bottleRoute = include('routes/bottle/bottle.routes')
const designationRoute = include('routes/bottle/designation.routes')
const vineyardRoute = include('routes/bottle/vineyard.routes')

const cellarRoute = include('routes/cellar/cellar.routes')
const wallRoute = include('routes/cellar/wall.routes')
const compartmentRoute = include('routes/cellar/compartment.routes')

const userRoute = include('routes/user/user.routes')
const authenticationRoute = include('routes/user/authentication.routes')
const testRoute = include('routes/user/test.routes')


module.exports = app => {
    // Set initial root.
    router.get('/', (request, response) => {
        response.json({ info: "Node.js, Express, and Postgres API. " })
    })

    // Set routes.

    // Bottle.
    app.use(CONSTANTS.ROOT.API + CONSTANTS.ROOT.OBJECT.BOTTLE.BOTTLE, bottleRoute(app))
    app.use(CONSTANTS.ROOT.API + CONSTANTS.ROOT.OBJECT.BOTTLE.DESIGNATION, designationRoute(app))
    app.use(CONSTANTS.ROOT.API + CONSTANTS.ROOT.OBJECT.BOTTLE.VINEYARD, vineyardRoute(app))

    // Cellar.
    app.use(CONSTANTS.ROOT.API + CONSTANTS.ROOT.OBJECT.CELLAR.CELLAR, cellarRoute(app))
    app.use(CONSTANTS.ROOT.API + CONSTANTS.ROOT.OBJECT.CELLAR.WALL, wallRoute(app))
    app.use(CONSTANTS.ROOT.API + CONSTANTS.ROOT.OBJECT.CELLAR.COMPARTMENT, compartmentRoute(app))

    // User.
    app.use(CONSTANTS.ROOT.API + CONSTANTS.ROOT.OBJECT.USER.USER, userRoute(app))
    app.use(CONSTANTS.ROOT.API + CONSTANTS.ROOT.OBJECT.USER.AUTHENTICATION, authenticationRoute(app))
    app.use(CONSTANTS.ROOT.API + CONSTANTS.ROOT.OBJECT.USER.TEST, testRoute(app))


    return router
}
