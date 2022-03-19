const db = include('models')
const ROLES = db.ROLES
const utilisateurModel = db.utilisateurModel


/**
 * Check if the if the user attributes in params already exists.
 *
 * @param request
 * @param response
 * @param next
 */
exports.checkDuplicateUsernameOrEmail = (request, response, next) => {
    // Username
    utilisateurModel.findOne({
        where: {
            username: request.body.username
        }
    })
        .then(user => {
            if (user) {
                response.status(400).send({
                    message: "Failed! Username is already in use!"
                })
                return
            }
            // Email
            utilisateurModel.findOne({
                where: {
                    email: request.body.email
                }
            })
                .then(user => {
                    if (user) {
                        response.status(400).send({
                            message: "Failed! Email is already in use!"
                        })
                        return
                    }
                    next()
                })
        })
}

/**
 * Check if the role in the body exists.
 * @param request
 * @param response
 * @param next
 */
exports.checkRolesExisted = (request, response, next) => {
    if (request.body.roles) {
        for (let i = 0; i < request.body.roles.length; i++) {
            if (!ROLES.includes(request.body.roles[i])) {
                response.status(400).send({
                    message: "Failed! Role does not exist = " + request.body.roles[i]
                })
                return
            }
        }
    }

    next()
}
