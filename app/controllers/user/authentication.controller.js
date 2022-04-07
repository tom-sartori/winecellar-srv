const db = include('models')
const userModel = db.userModel
const roleModel = db.roleModel
const refreshTokenModel = db.refreshTokenModel
const Op = db.Sequelize.Op

const refreshTokenController = include('controllers/user/refreshToken.controller')
const authenticationConfig = include("config/authentication")

const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const decrypt = include('middleware/crypto')


exports.signup = (request, response) => {
    // Save User to Database
    userModel.create({
        username: decrypt(request.body.username),
        email: decrypt(request.body.email),
        firstName: decrypt(request.body.firstName),
        lastName: decrypt(request.body.lastName),
        password: bcrypt.hashSync(decrypt(request.body.password), 10)
    })
        .then(user => {
            roleModel.findAll({
                where: {
                    name: 'user'
                }
            })
                .then(roles => {
                    user.setRoles(roles)
                        .then(() => {
                            response.send({ message: "Compte ajouté. Vous pouvez maintenant vous connecter. " })
                        })
                })
        })
        .catch(err => {
            response.status(500)
            response.send({ message: err.message })
        })
}

exports.signin = (request, response) => {
    userModel.findOne({
        where: {
            username: decrypt(request.body.username)
        }
    })
        .then(async (user) => {
            if (!user) {
                return response.status(404).send({ message: "User Not found." })
            }
            const passwordIsValid = bcrypt.compareSync(
                decrypt(request.body.password),
                user.password
            )
            if (!passwordIsValid) {
                return response.status(401).send({
                    accessToken: null,
                    message: "Invalid Password!"
                })
            }
            const token = jwt.sign({ id: user.id }, authenticationConfig.secret, {
                expiresIn: authenticationConfig.jwtExpirationTime
            })
            let refreshToken = await refreshTokenController.createToken(user)
            let authorities = []
            user.getRoles().then(roles => {
                for (let i = 0; i < roles.length; i++) {
                    authorities.push("ROLE_" + roles[i].name.toUpperCase())
                }
                response.status(200).send({
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    roles: authorities,
                    accessToken: token,
                    refreshToken: refreshToken,
                })
            })
        })
        .catch(err => {
            response.status(500).send({ message: err.message })
        })
}

exports.refreshToken = async (req, res) => {
    const { refreshToken: requestToken } = req.body
    if (requestToken == null) {
        return res.status(403).json({ message: "Refresh Token is required!" })
    }
    try {
        let refreshToken = await refreshTokenModel.findOne({ where: { token: requestToken } })
        if (!refreshToken) {
            res.status(403).json({ message: "Refresh token is not in database!" })
            return
        }
        if (refreshTokenController.verifyExpiration(refreshToken)) {
            refreshTokenModel.destroy({ where: { id: refreshToken.id } })

            res.status(403).json({
                message: "Refresh token was expired. Please make a new signin request",
            })
            return
        }
        let newAccessToken = jwt.sign({ id: refreshToken.userId }, authenticationConfig.secret, {
            expiresIn: authenticationConfig.jwtExpirationTime,
        })
        return res.status(200).json({
            accessToken: newAccessToken,
            refreshToken: refreshToken.token,
        })
    } catch (err) {
        return res.status(500).send({ message: err })
    }
}
