const express = require('express')
const router = express.Router()

const CONSTANTS = include('config/constants')

const { verifySignUp } = include("middleware")
const authenticationController = include("controllers/utilisateur/authentication.controller")


module.exports = app => {
    router.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        )
        next()
    })

    // Signup.
    router.post(CONSTANTS.ROOT.ACTION.SIGNUP,
        [
            verifySignUp.checkDuplicateUsernameOrEmail,
            verifySignUp.checkRolesExisted
        ],
        authenticationController.signup
    )

    // Signin.
    router.post(CONSTANTS.ROOT.ACTION.SIGNIN, authenticationController.signin)

    // Refresh token.
    router.post(CONSTANTS.ROOT.ACTION.REFRESH_TOKEN, authenticationController.refreshToken)

    return router
}
