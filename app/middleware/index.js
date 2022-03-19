const authJwt = include('middleware/authJwt')
const verifySignUp = include("middleware/verifySignUp")

module.exports = {
    authJwt,
    verifySignUp
}
