const express = require('express')
const router = express.Router()

const { authJwt } = include("middleware")
const testController = include("controllers/utilisateur/test.controller")


module.exports = app => {
    // app.use(function (req, res, next) {
    router.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        )
        next()
    })

    // All.
    router.get("/all", testController.allAccess)

    // User.
    router.get("/user",
        [authJwt.verifyToken],
        testController.userBoard
    )

    // Admin
    router.get("/admin",
        [authJwt.verifyToken, authJwt.isAdmin],
        testController.adminBoard
    )

    return router
}
