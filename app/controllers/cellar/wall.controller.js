const db = include('models')
const wallModel = db.wallModel
const cellarModel = db.cellarModel
const compartmentModel = db.compartmentModel
const pointModel = db.pointModel
const userModel = db.userModel



/**
 * INSERT INTO table (image) VALUES (?) RETURNING id, image
 *
 * @param cellarId
 * @param imagePath
 * @param userId
 * @returns {*}
 */
exports.create = async (cellarId, imagePath, userId) => {
    try {
        if (! await isUserCellar(cellarId, userId)) {
            return { Unauthorized: "User doesn't own the cellar. " }
        }

        return await wallModel.create({
            image: imagePath,
            cellarId: cellarId
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
        return await wallModel.findAll()
    } catch (error) {
        return error
    }
}

/**
 * Return every 'wall' that are in the 'cellarId'.
 * Also check that the user who requested own the cellar.
 * @param cellarId
 * @param userId
 * @returns {Promise<*|*>}
 */
exports.findAllFromCellarId = async (cellarId, userId) => {
    try {
        return await wallModel.findAll({
            include: {
                model: cellarModel,
                where: { id: cellarId },
                attributes: [],
                include: {
                    model: userModel,
                    where: { id: userId },
                    attributes: [],
                },
            }
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
        return await wallModel.findByPk(id)
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
        return await wallModel.update({ image: image }, {where: { id: id } })
    } catch (error) {
        return error
    }
}

/**
 * DELETE FROM table WHERE id = ?
 *
 * @returns {string|*}
 * @param wallId
 * @param userId
 */
exports.delete = async (wallId, userId) => {
    try {
        if (! await isUserWall(wallId, userId)) {
            return { Unauthorized: "User doesn't own the wall. " }
        }

        return await wallModel.destroy({ where: { id: wallId } })
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
 * Return true if the user own the cellar in params.
 *
 * @param cellarId
 * @param userId
 * @returns {Promise<boolean>}
 */
async function isUserCellar (cellarId, userId) {
    return 0 !== await cellarModel.count({
        where: { id: cellarId },
        include: {
            model: userModel,
            where: { id: userId }
        }
    })
}
