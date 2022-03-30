const db = include('models')
const utilisateurModel = db.utilisateurModel
const caveModel = db.caveModel
const murModel = db.murModel
const emplacementModel = db.emplacementModel
const pointModel = db.pointModel
const emplacementBouteilleModel = db.emplacementBouteilleModel

const sequelize = require('sequelize')


/**
 * INSERT INTO table (name) VALUES (?) RETURNING id, name
 *
 * @param murId
 * @param listPoint
 * @param userId
 * @returns {*}
 */
exports.create = async (murId, listPoint, userId) => {
    try {
        if (! await isUserMur(murId, userId)) {
            return { Unauthorized: "User doesn't own the mur. " }
        }

        return await emplacementModel.create({
            murId: murId,
            points: listPoint
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
exports.findAllByMur = async (murId, userId) => {
    try {
        if (! await isUserMur(murId, userId)) {
            return { Unauthorized: "User doesn't own the mur. " }
        }

        return await emplacementModel.findAll({
            include: [
                {
                    model: pointModel,
                    attributes: { exclude: ['emplacementId'] },
                    order: ['order']
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
        return await emplacementModel.findByPk(id)
    } catch (error) {
        return error
    }
}

/**
 * Add or remove a bottle from an emplacement.
 */
exports.update = async (emplacementId, bouteilleId, value, userId) => {
    try {
        if (! await isUserEmplacement(emplacementId, userId)) {
            return { Unauthorized: "User doesn't own the emplacement. " }
        }

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
    } catch (error) {
        return error
    }
}

/**
 * DELETE FROM table WHERE id = ?
 *
 * @param emplacementId
 * @param userId
 * @returns {string|*}
 */
exports.delete = async (emplacementId, userId) => {
    try {
        if (! await isUserEmplacement(emplacementId, userId)) {
            return { Unauthorized: "User doesn't own the emplacement. " }
        }

        return await emplacementModel.destroy({ where: { id: emplacementId } })
    } catch (error) {
        return error
    }
}



/**
 * Return true if the user own the mur in params.
 *
 * @param murId
 * @param userId
 * @returns {Promise<boolean>}
 */
async function isUserMur (murId, userId) {
    return 0 !== await murModel.count({
        where: { id: murId },
        include: {
            model: caveModel,
            include: {
                model: utilisateurModel,
                where: { id: userId }
            }
        }
    })
}

/**
 * Return true if the user own the emplacement in params.
 *
 * @param emplacementId
 * @param userId
 * @returns {Promise<boolean>}
 */
async function isUserEmplacement (emplacementId, userId) {
    return 0 !== await emplacementModel.count({
        where: { id: emplacementId },
        include: {
            model: murModel,
            include: {
                model: caveModel,
                include: {
                    model: utilisateurModel,
                    where: { id: userId }
                }
            }
        }
    })
}
