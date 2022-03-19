const db = include('models')
const utilisateurModel = db.utilisateurModel
const roleModel = db.roleModel
const refreshTokenModel = db.refreshTokenModel
const Op = db.Sequelize.Op

const refreshTokenController = include('controllers/utilisateur/refreshToken.controller')
const authenticationConfig = include("config/authentication")

const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")


exports.signup = (request, response) => {
    // Save User to Database
    utilisateurModel.create({
        username: request.body.username,
        email: request.body.email,
        password: bcrypt.hashSync(request.body.password, 10)
    })
        .then(user => {
            if (request.body.roles) {
                roleModel.findAll({
                    where: {
                        name: {
                            [Op.or]: request.body.roles
                        }
                    }
                })
                    .then(roles => {
                        user.setRoles(roles)
                            .then(() => {
                                response.send({ message: "User was registered successfully!" })
                            })
                    })
            } else {
                // user role = 1
                user.setRoles([1])
                    .then(() => {
                        response.send({ message: "User was registered successfully!" })
                    })
            }
        })
        .catch(err => {
            response.status(500)
            response.send({ message: err.message })
        })
}

exports.signin = (request, response) => {
    utilisateurModel.findOne({
        where: {
            username: request.body.username
        }
    })
        .then(async (user) => {
            if (!user) {
                return response.status(404).send({ message: "User Not found." })
            }
            const passwordIsValid = bcrypt.compareSync(
                request.body.password,
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
        let newAccessToken = jwt.sign({ id: refreshToken.utilisateurId }, authenticationConfig.secret, {
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
