const db = include('models')
const murModel = db.murModel
const emplacementModel = db.emplacementModel
const pointModel = db.pointModel
const emplacementBouteilleModel = db.emplacementBouteilleModel

const { Op } = require('@sequelize/core')
const sequelize = require('sequelize')


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
 * SELECT * By mur.
 *
 * @returns {*}
 */
exports.findAllByMur = async (murId) => {
    try {
        return await emplacementModel.findAll({
            include: [
                {
                    model: pointModel,
                    attributes: { exclude: ['emplacementId'] },
                    order: ['id']
                },
                {
                    model: murModel,
                    where: {id: murId},
                    attributes: []
                }
            ],
            attributes: { exclude: ['murId'] }
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

/**
 * Add a bottle to the emplacement.
 */
exports.update = async (emplacementId, bouteilleId, value) => {
    try {
        return await emplacementBouteilleModel.update(
            { quantity: sequelize.literal('quantity + ' + value) },
            {
                where: {
                    emplacementId: emplacementId,
                    bouteilleId: bouteilleId
                },
                individualHooks: true   // Used to trigger the hook.
            }
        )

        // return await emplacementBouteilleModel.increment(
        //     'quantity',
        //     {
        //         by: value,
        //         where: {
        //             emplacementId: emplacementId,
        //             bouteilleId: bouteilleId
        //         },
        //         individualHooks: true   // Used to trigger the hook.
        //     })
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
        return await emplacementModel.destroy({ where: { id: id } })
    } catch (error) {
        return error
    }
}
