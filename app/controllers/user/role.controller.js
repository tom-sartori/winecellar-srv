const roleModel = include('models').roleModel


/**
 * INSERT INTO table (name) VALUES (?) RETURNING id, name
 *
 * @param name
 * @returns {*}
 */
exports.create = async ({ name }) => {
    try {
        const role = await roleModel.findOrCreate({ where: { name: name } })
        return role[0]
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
        return await roleModel.findAll()
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
        return await roleModel.findByPk(id)
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
        return await roleModel.update({ name: name }, {where: { id: id } })
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
        return await roleModel.destroy({ where: { id: id } })
    } catch (error) {
        return error
    }
}
