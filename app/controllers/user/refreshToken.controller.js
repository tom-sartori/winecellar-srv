const refreshTokenModel = include('models').refreshTokenModel

const authenticationConfig = include("config/authentication")
const { v4: uuidv4 } = require("uuid")


/**
 * Create a new token.
 * @param user
 * @returns {Promise<*>}
 */
exports.createToken = async user => {
    let expiredAt = new Date()
    expiredAt.setSeconds(expiredAt.getSeconds() + authenticationConfig.jwtRefreshExpirationTime)
    let _token = uuidv4()
    let refreshToken = await refreshTokenModel.create({
        token: _token,
        userId: user.id,
        expiryDate: expiredAt.getTime(),
    })
    return refreshToken.token
}

/**
 * Check if the token in params is expired or not.
 *
 * @param token
 * @returns {boolean}
 */
exports.verifyExpiration = token => {
    return token.expiryDate.getTime() < new Date().getTime()
}
