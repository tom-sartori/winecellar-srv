const murModel = include('models').murModel


/**
 * INSERT INTO table (image) VALUES (?) RETURNING id, image
 *
 * @param image
 * @returns {*}
 */
exports.create = async ({ caveId, image }) => {
    try {
        return await murModel.create({
            image: image,
            caveId: caveId
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
        return await murModel.findAll()
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
        return await murModel.findByPk(id)
    } catch (error) {
        return error
    }
}

/**
 * UPDATE table SET image = ? WHERE id = ?
 *
 * @param id
 * @param image
 * @returns {string|*}
 */
exports.update = async ({ id, image }) => {
    try {
        return await murModel.update({ image: image }, {where: { id: id } })
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
        return await murModel.destroy({ where: { id: id } })
    } catch (error) {
        return error
    }
}
