const db = include('models')
const userModel = db.userModel
const roleModel = db.roleModel


/**
 * INSERT INTO table (name) VALUES (?) RETURNING id, name
 *
 * @returns {*}
 */
exports.create = async ({ email, lastName, firstName, password }) => {
    try {
        return await userModel.create({
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
        return await userModel.findAll({
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
        return await userModel.findByPk(id, {
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
        return await userModel.update({
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
exports.promoteAdmin = async (userId, username, email) => {
    try {
        return await userModel.findOne({
            where: {
                id: userId,
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
 * @param userId
 * @param username
 * @param email
 * @returns {string|*}
 */
exports.delete = async (userId, username, email) => {
    try {
        return await userModel.destroy({
            where: {
                id: userId,
                username: username,
                email: email
            }
        })
    } catch (error) {
        return error
    }
}
