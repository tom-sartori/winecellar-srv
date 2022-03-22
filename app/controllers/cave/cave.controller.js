const caveModel = include('models').caveModel
const utilisateurModel = include('models').utilisateurModel


/**
 * INSERT INTO table (name) VALUES (?) RETURNING id, name
 *
 * @param name
 * @param userId
 * @returns {*}
 */
exports.create = async (name, userId) => {
    try {
        const cave = await caveModel.create({ name: name })
        const user = await utilisateurModel.findByPk(userId)
        await cave.addUtilisateur(user)
        return cave
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
        return await caveModel.findAll({
            attributes: ['id', 'name'],
            include: {
                model: utilisateurModel,
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
        return await caveModel.findByPk(id)
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
        return await caveModel.update({ name: name }, {where: { id: id } })
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
        return await caveModel.destroy({ where: { id: id } })
    } catch (error) {
        return error
    }
}
