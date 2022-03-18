const emplacementModel = include('models').emplacementModel
const pointModel = include('models').pointModel


/**
 * INSERT INTO table (name) VALUES (?) RETURNING id, name
 *
 * @param name
 * @returns {*}
 */
exports.create = async ({ murId, points }) => {
    try {
        return await emplacementModel.create({
            murId: murId,
            points: points
        },{
            include: pointModel
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
        return await emplacementModel.findAll({
            include: {
                model: pointModel,
                attributes: { exclude: ["emplacementId"] }
            },
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
        return await emplacementModel.findByPk(id, {
            include: {
                model: pointModel,
                attributes: { exclude: ["emplacementId"] }
            },
        })
    } catch (error) {
        return error
    }
}

// /**
//  * UPDATE table SET name = ? WHERE id = ?
//  *
//  * @param id
//  * @param name
//  * @returns {string|*}
//  */
// exports.update = async ({ id, name }) => {
//     try {
//         return await emplacementModel.update({ name: name }, {where: { id: id } })
//     } catch (error) {
//         return error
//     }
// }

/**
 * DELETE FROM table WHERE id = ?
 *
 * @param id
 * @returns {string|*}
 */
exports.delete = async (id) => {
    try {
        return await emplacementModel.destroy({ where: { id: id } })
    } catch (error) {
        return error
    }
}
