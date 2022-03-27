const db = include('models')
const utilisateurModel = db.utilisateurModel
const roleModel = db.roleModel


/**
 * INSERT INTO table (name) VALUES (?) RETURNING id, name
 *
 * @returns {*}
 */
exports.create = async ({ email, lastName, firstName, password }) => {
    try {
        return await utilisateurModel.create({
            email: email,
            lastName: lastName,
            firstName: firstName,
            password: password
        })
    } catch (error) {
        return error
    }
}

/**
 * SELECT *
 *
 * @returns {*}
 */
exports.findAll = async () => {
    try {
        return await utilisateurModel.findAll({
            attributes: ['id', 'username', 'email', 'lastName', 'firstName'],
            order: ['lastName', 'firstName', 'username'],
            include: {
                model: roleModel,
                attributes: ['name'],
            }
        })
    } catch (error) {
        return error
    }
}

/**
 * SELECT * WHERE id = ?
 *
 * @param id
 * @returns {*}
 */
exports.findByPk = async (id) => {
    try {
        return await utilisateurModel.findByPk(id, {
            attributes: { exclude: ['password'] },
            include: roleModel
        })
    } catch (error) {
        return error
    }
}

/**
 * UPDATE table SET name = ? WHERE id = ?
 *
 * @param email
 * @param lastName
 * @param firstName
 * @param password
 * @returns {string|*}
 */
exports.update = async ({ email, lastName, firstName, password }) => {
    try {
        return await utilisateurModel.update({
            lastName: lastName,
            firstName: firstName,
            password: password
        }, {where: { email: email } })
    } catch (error) {
        return error
    }
}

/**
 * Promote user to role admin.
 */
exports.promoteAdmin = async (utilisateurId, username, email) => {
    try {
        return await utilisateurModel.findOne({
            where: {
                id: utilisateurId,
                username: username,
                email: email
            }
        }).then(user => {
            roleModel.findAll({
                where: {
                    name: 'admin'
                }
            })
                .then(roles => {
                    user.addRoles(roles)
                })
        })
    } catch (error) {
        return error
    }
}

/**
 * DELETE FROM table WHERE id = ?
 *
 * @param utilisateurId
 * @param username
 * @param email
 * @returns {string|*}
 */
exports.delete = async (utilisateurId, username, email) => {
    try {
        return await utilisateurModel.destroy({
            where: {
                id: utilisateurId,
                username: username,
                email: email
            }
        })
    } catch (error) {
        return error
    }
}
