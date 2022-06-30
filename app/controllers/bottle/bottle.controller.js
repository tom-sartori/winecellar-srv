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
 * @param userId
 * @param order Can be undefined.
 * @param direction Can be undefined.
 * @returns {Promise<{}|void|*>}
 */
exports.findAllByUser = async (userId, order, direction) => {
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

        return await findAllWithQuantitiesByListCompartment(listCompartmentId, order, direction)
    } catch (error) {
        return error
    }
}


/**
 * SELECT * BY compartment if owned by the user.
 *
 * @returns {*}
 */
exports.findAllByCompartment = async (compartmentId, userId, order, direction) => {
    try {
        if (! await isUserCompartment(compartmentId, userId)) {
            return { Unauthorized: "User doesn't own the compartment. " }
        }

        return await findAllWithQuantitiesByListCompartment([compartmentId], order, direction)
    } catch (error) {
        return error
    }
}

/**
 * SELECT * BY wall if owned by the user.
 *
 * @returns {*}
 */
exports.findAllByWall = async (wallId, userId, order, direction) => {
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

        return await findAllWithQuantitiesByListCompartment(listCompartmentId, order, direction)
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

exports.findByRegex = async (regex) => {
    console.log('REGEX')
    console.log(regex)
    return await bottleModel.findAll({

        where: {
            [Op.or]: [
                {
                    "bottleName.name": "La Capitelle"
                },
                {
                    vintageId: 1
                },
                // {
                //     '"bottleName.id"': 3
                // }
            ]
        },

//         [sequelize.literal(
//             '(SELECT sum(quantity) ' +
//             'FROM "compartmentBottles" ' +
//             'WHERE "compartmentBottles"."bottleId"="bottle"."id" ' +
//             'AND "compartmentBottles"."compartmentId" IN (' + listCompartmentId + ') )'),
//         'quantity']
// ],

        include: [
            bottleNameModel,
            designationModel,
            vineyardModel,
            vintageModel,
            wineTypeModel,
            bottleSizeModel
        ],

        // include: [
        //     {
        //         model: bottleNameModel,
        //         where: {
        //             name: { [Op.iRegexp]: regex }
        //         }
        //     },
        //     {
        //         model: designationModel,
        //         where: {name: {[Op.iRegexp]: regex}}
        //     }
        // ]
    })
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
 * @param order
 * @param direction
 * @returns {Promise<void>}
 */
async function findAllWithQuantitiesByListCompartment (listCompartmentId, order, direction) {
    order = checkOrder(order)
    direction = checkDirection(direction)

    return await bottleModel.findAll({
        attributes: {
            include: [
                [sequelize.literal(
                    '(SELECT sum(quantity) ' +
                    'FROM "compartmentBottles" ' +
                    'WHERE "compartmentBottles"."bottleId"="bottle"."id" ' +
                    'AND "compartmentBottles"."compartmentId" IN (' + listCompartmentId + ') )'),
                    'quantity']
            ],
            exclude: [
                "bottleNameId",
                "designationId",
                "vineyardId",
                "vintageId",
                "wineTypeId",
                "bottleSizeId"
            ]
        },
        include: [
            bottleNameModel,
            designationModel,
            vineyardModel,
            vintageModel,
            wineTypeModel,
            bottleSizeModel,
            {
                model: compartmentModel,
                where: {
                    id: {
                        [Op.or]: listCompartmentId,
                    }
                },
                attributes: []
            }
        ],
        order: [
            [sequelize.literal(order), direction],
            [sequelize.literal('"bottleName"."name"'), direction],
            [sequelize.literal('"vineyard"."name"'), direction],
            [sequelize.literal('"vintage"."name"'), direction],
            [sequelize.literal('"bottleSize"."name"'), direction],
            // [{ model: bottleNameModel }, 'name', 'ASC']
        ]
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

/**
 * For a requested order, check if it is available and return a normalized one.
 * @param requestedOrder
 * @returns {string}
 */
function checkOrder (requestedOrder) {
    let defaultValue = '"bottleName"."name"'
    if (requestedOrder === undefined) {
        return defaultValue
    }

    if (requestedOrder.match(new RegExp('quantity', 'gmi'))) {
        // Separated because doesn't have "name" attribute.
        return '"quantity"'
    }
    const listAvailableOrder = ['bottleName', 'designation', 'vineyard', 'wineType', 'bottleSize']

    for (let order of listAvailableOrder) {
        if (requestedOrder.match(new RegExp(order, 'gmi'))) {
            return '"' + order + '"' + '."name"'
        }

    }

    return defaultValue
}

function checkDirection (requestedDirection) {
    const listAvailableOrder = ['ASC', 'DESC']
    if (requestedDirection === undefined) {
        return listAvailableOrder[0]
    }

    for (let order of listAvailableOrder) {
        if (requestedDirection.match(new RegExp(order, 'gmi'))) {
            return order
        }
    }

    return listAvailableOrder[0]
}
