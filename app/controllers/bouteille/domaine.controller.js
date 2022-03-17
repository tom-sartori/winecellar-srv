const domaineModel = include('models').domaineModel


/**
 * INSERT INTO table (name) VALUES (?) RETURNING id, name
 *
 * @param name
 * @returns {*}
 */
exports.create = ({ name }) => {
    try {
        return domaineModel.create({ name })
    } catch (error) {
        return error
    }
}

/**
 * SELECT *
 *
 * @returns {*}
 */
exports.findAll = () => {
    try {
        return domaineModel.findAll()
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
exports.findByPk = (id) => {
    try {
        return domaineModel.findByPk(id)
    } catch (error) {
        return error
    }
}

/**
 * UPDATE table SET name = ? WHERE id = ?
 *
 * @param id
 * @param name
 * @returns {string|*}
 */
exports.update = (id,  name) => {
    try {
        domaineModel.update({ name }, {where: { id } })
        return 'Updated. '
    } catch (error) {
        return error
    }
}

/**
 * DELETE FROM table WHERE id = ?
 *
 * @param id
 * @returns {string|*}
 */
exports.delete = (id) => {
    try {
        domaineModel.destroy({ where: { id: id } })
        return 'Deleted. '
    } catch (error) {
        return error
    }
}
