const cellarModel = include('models').cellarModel
const userModel = include('models').userModel


/**
 * INSERT INTO table (name) VALUES (?) RETURNING id, name
 *
 * @param name
 * @param userId
 * @returns {*}
 */
exports.create = async (name, userId) => {
    try {
        const cellar = await cellarModel.create({ name: name })
        const user = await userModel.findByPk(userId)
        await cellar.addUser(user)
        return cellar
    } catch (error) {
        return error
    }
}

/**
 * SELECT *
 *
 * @returns {*}
 */
exports.findAll = async (userId) => {
    try {
        return await cellarModel.findAll({
            attributes: ['id', 'name'],
            include: {
                model: userModel,
                where: { id: userId },
                attributes: [],
            },
            order: ['name']
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
        return await cellarModel.findByPk(id)
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
        return await cellarModel.update({ name: name }, {where: { id: id } })
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
        return await cellarModel.destroy({ where: { id: id } })
    } catch (error) {
        return error
    }
}
