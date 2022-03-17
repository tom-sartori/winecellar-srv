const bouteilleModel = include('models').bouteilleModel


/**
 * INSERT INTO table (name) VALUES (?) RETURNING id, name
 *
 * @param name
 * @returns {*}
 */
exports.create = ({ name }) => {
    try {
        return bouteilleModel.create({ name: name })
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
        return bouteilleModel.findAll()
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
        return bouteilleModel.findByPk(id)
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
        bouteilleModel.update({ name: name }, {where: { id: id } })
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
        bouteilleModel.destroy({ where: { id: id } })
        return 'Deleted. '
    } catch (error) {
        return error
    }
}
