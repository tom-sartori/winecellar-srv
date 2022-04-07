const db = include('models')
const bottleModel = db.bottleModel
const designationModel = db.designationModel
const vineyardModel = db.vineyardModel
const vintageModel = db.vintageModel
const bottleNameModel = db.bottleNameModel
const bottleSizeModel = db.bottleSizeModel
const wineTypeModel = db.wineTypeModel

const compartmentBottleModel = db.compartmentBottleModel
const compartmentModel = db.compartmentModel
const wallModel = db.wallModel
const cellarModel = db.cellarModel
const userModel = db.userModel

const { Op } = require('@sequelize/core')
const sequelize = require('sequelize')



/**
 * INSERT INTO table (name) VALUES (?) RETURNING id
 *
 * @param designationName
 * @param vineyardName
 * @param vintageName
 * @param bottleNameName
 * @param bottleSizeName
 * @param wineTypeName
 * @returns {*}
 */
exports.create = async (designationName, vineyardName, vintageName, bottleNameName, bottleSizeName, wineTypeName) => {
    try {
        const designation = await designationModel.findOrCreate({ where: { name: designationName }} )
        const vineyard = await vineyardModel.findOrCreate({ where: { name: vineyardName }} )
        const vintage = await vintageModel.findOrCreate({ where: { name: vintageName }} )
        const bottleName = await bottleNameModel.findOrCreate({ where: { name: bottleNameName }} )
        const bottleSize = await bottleSizeModel.findOrCreate({ where: { name: bottleSizeName }} )
        const wineType = await wineTypeModel.findOrCreate({ where: { name: wineTypeName }} )

        const bottle = await bottleModel.findOrCreate({
                where: {
                    designationId: designation[0].id,
                    vineyardId: vineyard[0].id,
                    vintageId: vintage[0].id,
                    bottleNameId: bottleName[0].id,
                    bottleSizeId: bottleSize[0].id,
                    wineTypeId: wineType[0].id,
                }
            }
        )
        return bottle[0]
    } catch (error) {
        return error
    }
}

/**
 * Create a bottle and add it to the compartment.
 * If the bottle is already in the compartment, then return { Conflict: "Bottle already in the compartment. " }
 *
 * @param designationName
 * @param vineyardName
 * @param vintageName
 * @param bottleNameName
 * @param bottleSizeName
 * @param wineTypeName
 * @param compartmentId
 * @param userId
 * @returns {*}
 */
exports.createByCompartment = async (designationName, vineyardName, vintageName, bottleNameName, bottleSizeName, wineTypeName, compartmentId, userId) => {
    try {
        if (! await isUserCompartment(compartmentId, userId)) {
            return { Unauthorized: "User doesn't own the compartment. " }
        }

        const bottle = await this.create(designationName, vineyardName, vintageName, bottleNameName, bottleSizeName, wineTypeName)
        const compartmentBottle = await compartmentBottleModel.findOrCreate({
            where: {
                bottleId: bottle.id,
                compartmentId: compartmentId,
            },
            defaults: {
                quantity: 1,
            }
        })

        if (compartmentBottle[1]) {  // If created
            return compartmentBottle[0]
        }
        else {  // Compartment already existed.
            return { Conflict: "Bottle already in the compartment. " }
        }
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
        return await bottleModel.findAll({
            include: [
                designationModel,
                vineyardModel,
                vintageModel,
                bottleNameModel,
                bottleSizeModel,
                wineTypeModel
            ],
            attributes: { exclude: [
                    "designationId",
                    "vineyardId",
                    "vintageId",
                    "bottleNameId",
                    "bottleSizeId",
                    "wineTypeId"
                ]
            }
        })
    } catch (error) {
        return error
    }
}

/**
 * SELECT * BY USER
 *
 * @returns {*}
 */
exports.findAllByUser = async (userId) => {
    try {

        // Get every compartments for the user in params.
        const listCompartment = await compartmentModel.findAll({
            attributes: ['id'],
            include: {
                model: wallModel,
                attributes: [],
                where: {
                    id: {
                        [Op.not]: null
                    }
                },
                include: {
                    model: cellarModel,
                    attributes: [],
                    where: {
                        id: {
                            [Op.not]: null
                        }
                    },
                    include: {
                        model: userModel,
                        where: {id: userId},
                        attributes: []
                    }
                }
            }
        })

        if (listCompartment.length === 0) { // The user doesn't have any compartments, so the response is empty.
            return {}
        }

        let listCompartmentId = []
        for (let elt of listCompartment) {
            listCompartmentId.push(elt.id)
        }

        // Get 'bottleId' and sum of quantities inside every compartments got before.
        const listBottle = await getListCompartmentModelQuantity(listCompartmentId)

        for (let elt of listBottle) {
            elt.dataValues['bottle'] = await findByPkPretty(elt.dataValues.id)
        }

        return listBottle
    } catch (error) {
        return error
    }
}


/**
 * SELECT * BY compartment if owned by the user.
 *
 * @returns {*}
 */
exports.findAllByCompartment = async (compartmentId, userId) => {
    try {
        if (! await isUserCompartment(compartmentId, userId)) {
            return { Unauthorized: "User doesn't own the compartment. " }
        }

        // Get 'bottleId' and sum of quantities inside every compartments got before.
        const listBottle = await compartmentBottleModel.findAll({
            where: { compartmentId: compartmentId },
            attributes: [
                ['bottleId', 'id'],
                [sequelize.fn("SUM", sequelize.col("quantity")), 'quantity'],
            ],
            group: 'bottleId',
        })

        // Set 'bottle' values.
        for (let elt of listBottle) {
            elt.dataValues['bottle'] = await findByPkPretty(elt.dataValues.id)
        }

        return listBottle
    } catch (error) {
        return error
    }
}

/**
 * SELECT * BY wall if owned by the user.
 *
 * @returns {*}
 */
exports.findAllByWall = async (wallId, userId) => {
    try {
        // Get every compartments for the user in params.
        const listCompartment = await compartmentModel.findAll({
            attributes: ['id'],
            include: {
                model: wallModel,
                attributes: [],
                where: { id: wallId },
                include: {
                    model: cellarModel,
                    attributes: [],
                    where: {
                        id: {
                            [Op.not]: null
                        }
                    },
                    include: {
                        model: userModel,
                        where: {id: userId},
                        attributes: []
                    }
                }
            }
        })


        if (listCompartment.length === 0) { // The user doesn't have any compartments, so the response is empty.
            return {}
        }

        let listCompartmentId = []
        for (let elt of listCompartment) {
            listCompartmentId.push(elt.id)
        }

        // Get 'bottleId' and sum of quantities inside every compartments got before.
        const listBottle = await getListCompartmentModelQuantity(listCompartmentId)

        // Set 'bottle' values.
        for (let elt of listBottle) {
            elt.dataValues['bottle'] = await findByPkPretty(elt.dataValues.id)
        }

        return listBottle
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
        return await findByPkPretty(id)
    } catch (error) {
        return error
    }
}

/**
 * UPDATE table SET name = ? WHERE id = ?
 *
 * @param idBottle
 * @param designationName
 * @param vineyardName
 * @param vintageName
 * @param bottleNameName
 * @param bottleSizeName
 * @param wineTypeName
 * @returns {string|*}
 */
exports.update = async (idBottle, designationName, vineyardName, vintageName, bottleNameName, bottleSizeName, wineTypeName) => {
    try {
        const designation = await designationModel.findOrCreate({ where: { name: designationName }} )
        const vineyard = await vineyardModel.findOrCreate({ where: { name: vineyardName }} )
        const vintage = await vintageModel.findOrCreate({ where: { name: vintageName }} )
        const bottleName = await bottleNameModel.findOrCreate({ where: { name: bottleNameName }} )
        const bottleSize = await bottleSizeModel.findOrCreate({ where: { name: bottleSizeName }} )
        const wineType = await wineTypeModel.findOrCreate({ where: { name: wineTypeName }} )

        return await bottleModel.update({
                designationId: designation[0].id,
                vineyardId: vineyard[0].id,
                vintageId: vintage[0].id,
                bottleNameId: bottleName[0].id,
                bottleSizeId: bottleSize[0].id,
                wineTypeId: wineType[0].id,
            },
            { where: { id: idBottle } }
        )
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
        return await bottleModel.destroy({ where: { id: id } })
    } catch (error) {
        return error
    }
}

/**
 * DELETE FROM table WHERE id = ?
 * Delete a bottle stored in an compartment.
 *
 * @param bottleId
 * @param compartmentId
 * @param userId
 * @returns {string|*}
 */
exports.deleteByCompartment = async (bottleId, compartmentId, userId) => {
    try {
        if (! await isUserCompartment(compartmentId, userId)) {
            return { Unauthorized: "User doesn't own the compartment. " }
        }

        return await compartmentBottleModel.destroy({
            where: {
                bottleId: bottleId,
                compartmentId: compartmentId
            }
        })
    } catch (error) {
        return error
    }
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


/**
 * For a list of compartmentId in params : get the bottles and their quantities inside those compartments.
 * GROUP BY bottleId.
 *
 * @param listCompartmentId
 * @returns {Promise<void>}
 */
async function getListCompartmentModelQuantity (listCompartmentId) {
    // Get 'bottleId' and sum of quantities inside every compartments got before.
    return await compartmentBottleModel.findAll({
        attributes: [
            ['bottleId', 'id'],
            [sequelize.fn("SUM", sequelize.col("quantity")), 'quantity'],
        ],
        group: 'bottleId',
        where: {
            compartmentId: {
                [Op.or]: listCompartmentId,
            }
        }
    })
}

/**
 * Find by primary key a bottle. Join all foreign tables and remove useless attributes.
 *
 * @param bottleId
 * @returns {Promise<*>}
 */
async function findByPkPretty (bottleId) {
    return await bottleModel.findByPk(bottleId, {
        include: [
            bottleNameModel,
            designationModel,
            vineyardModel,
            vintageModel,
            wineTypeModel,
            bottleSizeModel
        ],
        attributes: {
            exclude: [
                "id",
                "bottleNameId",
                "designationId",
                "vineyardId",
                "vintageId",
                "wineTypeId",
                "bottleSizeId"
            ]
        }
    })
}
