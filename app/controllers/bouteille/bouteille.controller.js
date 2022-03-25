const db = include('models')
const bouteilleModel = db.bouteilleModel
const appellationModel = db.appellationModel
const domaineModel = db.domaineModel
const millesimeModel = db.millesimeModel
const nomBouteilleModel = db.nomBouteilleModel
const tailleBouteilleModel = db.tailleBouteilleModel
const typeVinModel = db.typeVinModel

const emplacementBouteilleModel = db.emplacementBouteilleModel
const emplacementModel = db.emplacementModel
const murModel = db.murModel
const caveModel = db.caveModel
const utilisateurModel = db.utilisateurModel

const { Op } = require('@sequelize/core')
const sequelize = require('sequelize')



/**
 * INSERT INTO table (name) VALUES (?) RETURNING id
 *
 * @param appellationName
 * @param domaineName
 * @param millesimeName
 * @param nomBouteilleName
 * @param tailleBouteilleName
 * @param typeVinName
 * @returns {*}
 */
exports.create = async (appellationName, domaineName, millesimeName, nomBouteilleName, tailleBouteilleName, typeVinName) => {
    try {
        const appellation = await appellationModel.findOrCreate({ where: { name: appellationName }} )
        const domaine = await domaineModel.findOrCreate({ where: { name: domaineName }} )
        const millesime = await millesimeModel.findOrCreate({ where: { name: millesimeName }} )
        const nomBouteille = await nomBouteilleModel.findOrCreate({ where: { name: nomBouteilleName }} )
        const tailleBouteille = await tailleBouteilleModel.findOrCreate({ where: { name: tailleBouteilleName }} )
        const typeVin = await typeVinModel.findOrCreate({ where: { name: typeVinName }} )

        const bouteille = await bouteilleModel.findOrCreate({
                where: {
                    appellationId: appellation[0].id,
                    domaineId: domaine[0].id,
                    millesimeId: millesime[0].id,
                    nomBouteilleId: nomBouteille[0].id,
                    tailleBouteilleId: tailleBouteille[0].id,
                    typeVinId: typeVin[0].id,
                }
            }
        )
        return bouteille[0]
    } catch (error) {
        return error
    }
}


/**
 * Create a bottle and add it to the emplacement.
 *
 * @param appellationName
 * @param domaineName
 * @param millesimeName
 * @param nomBouteilleName
 * @param tailleBouteilleName
 * @param typeVinName
 * @param emplacementId
 * @returns {*}
 */
exports.createByEmplacement = async (appellationName, domaineName, millesimeName, nomBouteilleName, tailleBouteilleName, typeVinName, emplacementId) => {
    try {
        const bouteille = await this.create(appellationName, domaineName, millesimeName, nomBouteilleName, tailleBouteilleName, typeVinName)
        await emplacementBouteilleModel.create(
            {
                bouteilleId: bouteille.id,
                emplacementId: emplacementId,
                quantity: 1
            }
        )
        return bouteille
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
        return await bouteilleModel.findAll({
            include: [
                appellationModel,
                domaineModel,
                millesimeModel,
                nomBouteilleModel,
                tailleBouteilleModel,
                typeVinModel
            ],
            attributes: { exclude: [
                    "appellationId",
                    "domaineId",
                    "millesimeId",
                    "nomBouteilleId",
                    "tailleBouteilleId",
                    "typeVinId"
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

        // Get every emplacements for the user in params.
        const listEmplacement = await emplacementModel.findAll({
            attributes: ['id'],
            include: {
                model: murModel,
                attributes: [],
                where: {
                    id: {
                        [Op.not]: null
                    }
                },
                include: {
                    model: caveModel,
                    attributes: [],
                    where: {
                        id: {
                            [Op.not]: null
                        }
                    },
                    include: {
                        model: utilisateurModel,
                        where: {id: userId},
                        attributes: []
                    }
                }
            }
        })

        let listIdEmplacement = []
        for (let elt of listEmplacement) {
            listIdEmplacement.push(elt.id)
        }

        // Get 'bouteilleId' and sum of quantities inside every emplacements got before.
        const listBouteille = await emplacementBouteilleModel.findAll({
            attributes: [
                ['bouteilleId', 'id'],
                [sequelize.fn("SUM", sequelize.col("quantity")), 'quantity'],
            ],
            group: 'bouteilleId',
            where: {
                emplacementId: {
                    [Op.or]: listIdEmplacement,
                }
            }
        })

        // Set 'bouteille' values.
        for (let elt of listBouteille) {
            elt.dataValues['bouteille'] = await bouteilleModel.findByPk(elt.dataValues.id, {
                    include: [
                        nomBouteilleModel,
                        appellationModel,
                        domaineModel,
                        millesimeModel,
                        typeVinModel,
                        tailleBouteilleModel
                    ],
                    attributes: {
                        exclude: [
                            "id",
                            "nomBouteilleId",
                            "appellationId",
                            "domaineId",
                            "millesimeId",
                            "typeVinId",
                            "tailleBouteilleId"
                        ]
                    }
                }
            )
        }

        return listBouteille
    } catch (error) {
        return error
    }
}


/**
 * SELECT * BY emplacement if owned by the user.
 *
 * @returns {*}
 */
exports.findAllByEmplacement = async (emplacementId, userId) => {
    try {
        const isUserEmplacement = await emplacementModel.count({
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

        if (!isUserEmplacement) {
            // User doesn't own the emplacement.
            return { notAuthorized: 'Not authorized. ' }
        }


        // Get 'bouteilleId' and sum of quantities inside every emplacements got before.
        const listBouteille = await emplacementBouteilleModel.findAll({
            where: { emplacementId: emplacementId },
            attributes: [
                ['bouteilleId', 'id'],
                [sequelize.fn("SUM", sequelize.col("quantity")), 'quantity'],
            ],
            group: 'bouteilleId',
        })

        // Set 'bouteille' values.
        for (let elt of listBouteille) {
            elt.dataValues['bouteille'] = await bouteilleModel.findByPk(elt.dataValues.id, {
                    include: [
                        nomBouteilleModel,
                        appellationModel,
                        domaineModel,
                        millesimeModel,
                        typeVinModel,
                        tailleBouteilleModel
                    ],
                    attributes: {
                        exclude: [
                            "id",
                            "nomBouteilleId",
                            "appellationId",
                            "domaineId",
                            "millesimeId",
                            "typeVinId",
                            "tailleBouteilleId"
                        ]
                    }
                }
            )
        }

        return listBouteille
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
        return await bouteilleModel.findByPk(id, {
            include: [
                appellationModel,
                domaineModel,
                millesimeModel,
                nomBouteilleModel,
                tailleBouteilleModel,
                typeVinModel
            ],
            attributes: { exclude: [
                    "appellationId",
                    "domaineId",
                    "millesimeId",
                    "nomBouteilleId",
                    "tailleBouteilleId",
                    "typeVinId"
                ]
            }
        })
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
exports.update = async ({ idBouteille, appellationName, domaineName, millesimeName, nomBouteilleName, tailleBouteilleName, typeVinName }) => {
    try {
        const appellation = await appellationModel.findOrCreate({ where: { name: appellationName }} )
        const domaine = await domaineModel.findOrCreate({ where: { name: domaineName }} )
        const millesime = await millesimeModel.findOrCreate({ where: { name: millesimeName }} )
        const nomBouteille = await nomBouteilleModel.findOrCreate({ where: { name: nomBouteilleName }} )
        const tailleBouteille = await tailleBouteilleModel.findOrCreate({ where: { name: tailleBouteilleName }} )
        const typeVin = await typeVinModel.findOrCreate({ where: { name: typeVinName }} )

        return await bouteilleModel.update({
                appellationId: appellation[0].id,
                domaineId: domaine[0].id,
                millesimeId: millesime[0].id,
                nomBouteilleId: nomBouteille[0].id,
                tailleBouteilleId: tailleBouteille[0].id,
                typeVinId: typeVin[0].id,
            },
            { where: { id: idBouteille } }
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
        return await bouteilleModel.destroy({ where: { id: id } })
    } catch (error) {
        return error
    }
}

/**
 * DELETE FROM table WHERE id = ?
 * Delete a bottle stored in an emplacement.
 *
 * @param bouteilleId
 * @param emplacementId
 * @returns {string|*}
 */
exports.deleteByEmplacement = async (bouteilleId, emplacementId) => {
    try {
        return await emplacementBouteilleModel.destroy({
            where: {
                bouteilleId: bouteilleId,
                emplacementId: emplacementId
            }
        })
    } catch (error) {
        return error
    }
}
