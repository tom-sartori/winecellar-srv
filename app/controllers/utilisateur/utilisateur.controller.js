const utilisateurModel = include('models').utilisateurModel


/**
 * INSERT INTO table (name) VALUES (?) RETURNING id, name
 *
 * @returns {*}
 */
exports.create = ({ email, lastName, firstName, password }) => {
    try {

        return utilisateurModel.create({
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
        return await utilisateurModel.findAll()
    } catch (error) {
        return error
    }
}

/**
 * SELECT * WHERE id = ?
 *
 * @param email
 * @returns {*}
 */
exports.findByPk = async ({ email }) => {
    try {
        return await utilisateurModel.findByPk(email)
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
exports.update = ({ email, lastName, firstName, password }) => {
    try {
        utilisateurModel.update({
            lastName: lastName,
            firstName: firstName,
            password: password
        }, {where: { email: email } })
        return 'Updated. '
    } catch (error) {
        return error
    }
}

/**
 * DELETE FROM table WHERE id = ?
 *
 * @param email
 * @returns {string|*}
 */
exports.delete = ({ email }) => {
    try {
        utilisateurModel.destroy({ where: { email: email } })
        return 'Deleted. '
    } catch (error) {
        return error
    }
}
