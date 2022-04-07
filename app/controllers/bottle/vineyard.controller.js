const vineyardModel = include('models').vineyardModel


/**
 * INSERT INTO table (name) VALUES (?) RETURNING id, name
 *
 * @param name
 * @returns {*}
 */
exports.create = async ({ name }) => {
    try {
        const vineyard = await vineyardModel.findOrCreate({ where: { name: name } })
        return vineyard[0]
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
        return await vineyardModel.findAll()
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
        return await vineyardModel.findByPk(id)
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
        return await vineyardModel.update({ name: name }, {where: { id: id } })
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
        return await vineyardModel.destroy({ where: { id: id } })
    } catch (error) {
        return error
    }
}
