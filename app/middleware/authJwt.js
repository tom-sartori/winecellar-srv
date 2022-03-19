const jwt = require("jsonwebtoken")
const authenticationConfig = include('config/authentication')
const utilisateurModel = include('models').utilisateurModel


/**
 * Check if the user in the request has a valid token.
 * @param request
 * @param response
 * @param next
 * @returns {*}
 */
exports.verifyToken = (request, response, next) => {
    let token = request.headers["x-access-token"]
    if (!token) {
        return response.status(403).send({ message: "No token provided!" })
    }
    jwt.verify(token, authenticationConfig.secret, (error, decoded) => {
        if (error) {
            return catchError(error, response)
        }
        request.userId = decoded.id
        next()
    })
}

/**
 * Check if the user in the request is admin.
 * @param request
 * @param response
 * @param next
 */
exports.isAdmin = (request, response, next) => {
    utilisateurModel.findByPk(request.userId).then(user => {
        user.getRoles().then(roles => { /// FIXME
            for (let i = 0; i < roles.length; i++) {
                if (roles[i].name === "admin") {
                    next()
                    return
                }
            }
            response.status(403)
            response.send({ message: "Require Admin Role!" })
        })
    })
}


// Added with token expiration. Can catch the error of expiration token in verifyToken.
const { TokenExpiredError } = jwt
const catchError = (error, response) => {
    if (error instanceof TokenExpiredError) {
        return response.status(401).send({ message: "Unauthorized! Access Token was expired!" })
    }
    return response.sendStatus(401).send({ message: "Unauthorized!" })
}
