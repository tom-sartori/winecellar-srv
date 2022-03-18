const bouteilleModel = include('models').bouteilleModel
const appellationModel = include('models').appellationModel
const domaineModel = include('models').domaineModel
const millesimeModel = include('models').millesimeModel
const nomBouteilleModel = include('models').nomBouteilleModel
const tailleBouteilleModel = include('models').tailleBouteilleModel
const typeVinModel = include('models').typeVinModel


/**
 * INSERT INTO table (name) VALUES (?) RETURNING id
 *
 * @param name
 * @returns {*}
 */
exports.create = async ({ appellationName, domaineName, millesimeName, nomBouteilleName, tailleBouteilleName, typeVinName }) => {
    try {
        const appellation = await appellationModel.findOrCreate({ where: { name: appellationName }} )
        const domaine = await domaineModel.findOrCreate({ where: { name: domaineName }} )
        const millesime = await millesimeModel.findOrCreate({ where: { name: millesimeName }} )
        const nomBouteille = await nomBouteilleModel.findOrCreate({ where: { name: nomBouteilleName }} )
        const tailleBouteille = await tailleBouteilleModel.findOrCreate({ where: { name: tailleBouteilleName }} )
        const typeVin = await typeVinModel.findOrCreate({ where: { name: typeVinName }} )

        const result = await bouteilleModel.create({
                appellationId: appellation[0].id,
                domaineId: domaine[0].id,
                millesimeId: millesime[0].id,
                nomBouteilleId: nomBouteille[0].id,
                tailleBouteilleId: tailleBouteille[0].id,
                typeVinId: typeVin[0].id,
            }
        )

        return result == null ? 'Error while creating. ' : result
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

        const result = await bouteilleModel.update({
                appellationId: appellation[0].id,
                domaineId: domaine[0].id,
                millesimeId: millesime[0].id,
                nomBouteilleId: nomBouteille[0].id,
                tailleBouteilleId: tailleBouteille[0].id,
                typeVinId: typeVin[0].id,
            },
            { where: { id: idBouteille } }
        )

        return result === 1 ? 'Updated. ' : 'Error while updating. '
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
        return await bouteilleModel.destroy({ where: { id: id } }) === 0 ? 'Deleted. ' : 'Error while deleting. '
    } catch (error) {
        return error
    }
}
