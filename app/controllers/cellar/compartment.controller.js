const db = include('models')
const userModel = db.userModel
const cellarModel = db.cellarModel
const wallModel = db.wallModel
const compartmentModel = db.compartmentModel
const pointModel = db.pointModel
const compartmentBottleModel = db.compartmentBottleModel

const sequelize = require('sequelize')


/**
 * INSERT INTO table (name) VALUES (?) RETURNING id, name
 *
 * @param wallId
 * @param listPoint
 * @param userId
 * @returns {*}
 */
exports.create = async (wallId, listPoint, userId) => {
    try {
        if (! await isUserWall(wallId, userId)) {
            return { Unauthorized: "User doesn't own the wall. " }
        }

        return await compartmentModel.create({
            wallId: wallId,
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
        return await compartmentModel.findAll({
            include: {
                model: pointModel,
                attributes: { exclude: ["compartmentId"] }
            },
        })
    } catch (error) {
        return error
    }
}

/**
 * SELECT * By wall.
 *
 * @returns {*}
 */
exports.findAllByWall = async (wallId, userId) => {
    try {
        if (! await isUserWall(wallId, userId)) {
            return { Unauthorized: "User doesn't own the wall. " }
        }

        return await compartmentModel.findAll({
            include: [
                {
                    model: pointModel,
                    attributes: { exclude: ['compartmentId'] },
                    order: ['order']
                },
                {
                    model: wallModel,
                    where: {id: wallId},
                    attributes: []
                }
            ],
            attributes: { exclude: ['wallId'] }
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
        return await compartmentModel.findByPk(id)
    } catch (error) {
        return error
    }
}

/**
 * Add or remove a bottle from an compartment.
 */
exports.update = async (compartmentId, bottleId, value, userId) => {
    try {
        if (! await isUserCompartment(compartmentId, userId)) {
            return { Unauthorized: "User doesn't own the compartment. " }
        }

        return await compartmentBottleModel.update(
            { quantity: sequelize.literal('quantity + ' + value) },
            {
                where: {
                    compartmentId: compartmentId,
                    bottleId: bottleId
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
 * @param compartmentId
 * @param userId
 * @returns {string|*}
 */
exports.delete = async (compartmentId, userId) => {
    try {
        if (! await isUserCompartment(compartmentId, userId)) {
            return { Unauthorized: "User doesn't own the compartment. " }
        }

        return await compartmentModel.destroy({ where: { id: compartmentId } })
    } catch (error) {
        return error
    }
}



/**
 * Return true if the user own the wall in params.
 *
 * @param wallId
 * @param userId
 * @returns {Promise<boolean>}
 */
async function isUserWall (wallId, userId) {
    return 0 !== await wallModel.count({
        where: { id: wallId },
        include: {
            model: cellarModel,
            include: {
                model: userModel,
                where: { id: userId }
            }
        }
    })
}

/**
 * Return true if the user own the compartment in params.
 *
 * @param compartmentId
 * @param userId
 * @returns {Promise<boolean>}
 */
async function isUserCompartment (compartmentId, userId) {
    return 0 !== await compartmentModel.count({
        where: { id: compartmentId },
        include: {
            model: wallModel,
            include: {
                model: cellarModel,
                include: {
                    model: userModel,
                    where: { id: userId }
                }
            }
        }
    })
}
