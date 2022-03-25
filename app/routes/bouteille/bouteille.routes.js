const express = require('express')
const router = express.Router()

const CONSTANTS = include('config/constants')
const { authJwt } = include("middleware")

const bouteilleController = include('controllers/bouteille/bouteille.controller')

/**
 * Connect all routes to controller actions.
 */
module.exports = app => {

    /**
     * INSERT INTO table (name) VALUES (?) RETURNING id, name
     * Create or find a bottle.
     * If an emplacementId is specified in the body, then the bottle is added to the emplacement.
     */
    router.post(CONSTANTS.ROOT.ACTION.CREATE, [authJwt.verifyToken], async (request, response) => {
        const appellationName = request.body.appellationName
        const domaineName = request.body.domaineName
        const millesimeName = request.body.millesimeName
        const nomBouteilleName = request.body.nomBouteilleName
        const tailleBouteilleName = request.body.tailleBouteilleName
        const typeVinName = request.body.typeVinName

        if (
            appellationName === undefined ||
            domaineName === undefined ||
            millesimeName === undefined ||
            nomBouteilleName === undefined ||
            tailleBouteilleName === undefined ||
            typeVinName === undefined) {
            response.sendStatus(400)    // Bad request.
        }

        const emplacementId = request.body.emplacementId
        try {
            let bouteille = null
            if (emplacementId === undefined){
                bouteille = await bouteilleController.create(appellationName, domaineName, millesimeName, nomBouteilleName, tailleBouteilleName, typeVinName)
            }
            else  {
                bouteille = await bouteilleController.createByEmplacement(appellationName, domaineName, millesimeName, nomBouteilleName, tailleBouteilleName, typeVinName, emplacementId)
            }


            if (bouteille.id) {
                response.status(201)    // Created.
                response.send(bouteille)
            }
            else {
                response.status(500)    // Error while creating.
                response.send(bouteille)
            }
        } catch (error) {
            return error
        }
    })

    /**
     * SELECT *
     */
    router.get(CONSTANTS.ROOT.ACTION.FIND_ALL + CONSTANTS.ROOT.ACTION.ALL, async (request, response) => {
        try {
            response.send(await bouteilleController.findAll())
        }
        catch (error) {
            return error
        }
    })

    /**
     * SELECT * BY USER in headers.
     */
    router.get(CONSTANTS.ROOT.ACTION.FIND_ALL, [authJwt.verifyToken], async (request, response) => {
        try {
            const bouteille = await bouteilleController.findAllByUser(request.userId)

            if (bouteille) {
                response.status(200).send(bouteille)
            }
            else {
                response.status(500).send(bouteille)
            }
        }
        catch (error) {
            return error
        }
    })

    /**
     * SELECT * BY emplacement if owned by the user in headers.
     */
    router.get(CONSTANTS.ROOT.ACTION.FIND_ALL + CONSTANTS.ROOT.PARAM.EMPLACEMENT_ID, [authJwt.verifyToken], async (request, response) => {
        try {
            const bouteille = await bouteilleController.findAllByEmplacement(request.params.emplacementId, request.userId)

            if (bouteille.notAuthorized) {
                response.status(403).send('User doesn\'t own the emplacement. ')
            }
            else if (bouteille) {
                response.status(200).send(bouteille)
            }
            else {
                response.status(500).send(bouteille)
            }
        }
        catch (error) {
            return error
        }
    })

    /**
     * SELECT * WHERE id = ?
     */
    router.get(
        CONSTANTS.ROOT.ACTION.FIND_BY_PK +
        CONSTANTS.ROOT.PARAM.ID
        , async (request, response) => {
            try {
                const bouteille = await bouteilleController.findByPk(request.params.id)
                bouteille === null ? response.sendStatus(204) : response.send(bouteille)
            }
            catch (error) {
                return error
            }
        })

    /**
     * UPDATE table SET name = ? WHERE id = ?
     */
    router.put(CONSTANTS.ROOT.ACTION.UPDATE, async (request, response) => {
        try {
            const bouteille = await bouteilleController.update(request.body)
            bouteille == 0 ? response.sendStatus(404) : response.sendStatus(204)
        } catch (error) {
            return error
        }
    })

    /**
     * DELETE FROM table WHERE id = ?
     */
    router.delete(
        CONSTANTS.ROOT.ACTION.DELETE +
        CONSTANTS.ROOT.PARAM.ID
        , async (request, response) => {
            try {
                await bouteilleController.delete(request.params.id)
                response.sendStatus(204)    // Deleted.
            } catch (error) {
                return error
            }
        })

    /**
     * DELETE FROM table WHERE id = ?
     * Delete a bottle stored in an emplacement.
     */
    router.delete(
        CONSTANTS.ROOT.ACTION.DELETE +
        CONSTANTS.ROOT.PARAM.ID +
        CONSTANTS.ROOT.PARAM.EMPLACEMENT_ID
        , async (request, response) => {
            try {
                await bouteilleController.deleteByEmplacement(request.params.id, request.params.emplacementId)
                response.sendStatus(204)    // Deleted.
            } catch (error) {
                return error
            }
        })

    return router
}
