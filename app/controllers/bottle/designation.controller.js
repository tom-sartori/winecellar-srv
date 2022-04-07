const designationModel = include('models').designationModel


/**
 * INSERT INTO table (name) VALUES (?) RETURNING id, name
 *
 * @param name
 * @returns {*}
 */
exports.create = async ({ name }) => {
    try {
        const designation = await designationModel.findOrCreate({ where: { name: name } })
        return designation[0]
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
        return await designationModel.findAll()
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
        return await designationModel.findByPk(id)
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
exports.update = async ({ id, name }) => {
    try {
        return await designationModel.update({ name: name }, {where: { id: id } })
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
exports.delete = async (id) => {
    try {
        return await designationModel.destroy({ where: { id: id } })
    } catch (error) {
        return error
    }
}
