const express = require('express')
const router = express.Router()

const CONSTANTS = include('config/constants')
const { authJwt } = include("middleware")

const bottleController = include('controllers/bottle/bottle.controller')

/**
 * Connect all routes to controller actions.
 */
module.exports = app => {

    /**
     * INSERT INTO table (name) VALUES (?) RETURNING id, name
     * Create or find a bottle.
     * If an compartmentId is specified in the body, then the bottle is added to the compartment.
     */
    router.post(CONSTANTS.ROOT.ACTION.CREATE, [authJwt.verifyToken], async (request, response) => {
        const designationName = request.body.designationName
        const vineyardName = request.body.vineyardName
        const vintageName = request.body.vintageName
        const bottleNameName = request.body.bottleNameName
        const bottleSizeName = request.body.bottleSizeName
        const wineTypeName = request.body.wineTypeName

        if (
            designationName === undefined ||
            vineyardName === undefined ||
            vintageName === undefined ||
            bottleNameName === undefined ||
            bottleSizeName === undefined ||
            wineTypeName === undefined) {
            response.sendStatus(400)    // Bad request.
        }

        const compartmentId = request.body.compartmentId
        try {
            let bottle
            if (compartmentId === undefined){
                bottle = await bottleController.create(designationName, vineyardName, vintageName, bottleNameName, bottleSizeName, wineTypeName)
            }
            else  {
                bottle = await bottleController.createByCompartment(designationName, vineyardName, vintageName, bottleNameName, bottleSizeName, wineTypeName, compartmentId, request.userId)
            }


            if (bottle.Unauthorized) {
                response.status(401).send(bottle)    // Unauthorized: "User doesn't own the compartment. "
            }
            else if (bottle.Conflict) {
                response.status(409).send(bottle)    // Conflict: "Bottle already in the compartment. "
            }
            else if (bottle.dataValues) {
                response.status(201).send(bottle)    // Created.
            }
            else {
                response.status(500).send(bottle)    // Error while creating.
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
            response.send(await bottleController.findAll())
        }
        catch (error) {
            return error
        }
    })

    /**
     * SELECT * BY USER in headers.
     */
    router.get(CONSTANTS.ROOT.ACTION.FIND_ALL, [authJwt.verifyToken], async (request, response) => {
        await requestFindAllByUser(response, request.userId)
    })

    /**
     * SELECT * BY USER in headers.
     * With order.
     */
    router.get(CONSTANTS.ROOT.ACTION.FIND_ALL + CONSTANTS.ROOT.PARAM.ORDER, [authJwt.verifyToken], async (request, response) => {
        await requestFindAllByUser(response, request.userId, request.params.order)
    })

    /**
     * SELECT * BY USER in headers.
     * With order and direction.
     */
    router.get(CONSTANTS.ROOT.ACTION.FIND_ALL + CONSTANTS.ROOT.PARAM.ORDER + CONSTANTS.ROOT.PARAM.DIRECTION, [authJwt.verifyToken], async (request, response) => {
        await requestFindAllByUser(response, request.userId, request.params.order, request.params.direction)
    })

    /**
     * SELECT * BY compartment if owned by the user in headers.
     */
    router.get(CONSTANTS.ROOT.ACTION.FIND_ALL + CONSTANTS.ROOT.PARAM.COMPARTMENT_ID, [authJwt.verifyToken], async (request, response) => {
        try {
            const bottle = await bottleController.findAllByCompartment(request.params.compartmentId, request.userId)

            if (bottle.Unauthorized) {
                response.status(401).send(bottle)    // Unauthorized: "User doesn't own the compartment. "
            }
            else if (bottle) {
                response.status(200).send(bottle)
            }
            else {
                response.status(500).send(bottle)
            }
        }
        catch (error) {
            return error
        }
    })

    /**
     * SELECT * BY wall if owned by the user in headers.
     */
    router.get(CONSTANTS.ROOT.ACTION.FIND_ALL + CONSTANTS.ROOT.PARAM.WALL_ID, [authJwt.verifyToken], async (request, response) => {
        try {
            const bottle = await bottleController.findAllByWall(request.params.wallId, request.userId)

            if (bottle) {
                response.status(200).send(bottle)
            }
            else {
                response.status(500).send(bottle)
            }
        }
        catch (error) {
            return error
        }
    })

    /**
     * SELECT * WHERE id = ?
     */
    router.get(CONSTANTS.ROOT.ACTION.FIND_BY_PK + CONSTANTS.ROOT.PARAM.ID, async (request, response) => {
        try {
            const bottle = await bottleController.findByPk(request.params.id)

            bottle === null ? response.sendStatus(204) : response.send(bottle)
        }
        catch (error) {
            return error
        }
    })

    /**
     * UPDATE table SET name = ? WHERE id = ?
     */
    router.put(CONSTANTS.ROOT.ACTION.UPDATE, [authJwt.verifyToken, authJwt.isAdmin], async (request, response) => {
        try {
            const bottleId = request.body.bottleId

            if (bottleId === undefined) {
                response.status(400).send({ message: 'Need a bottleId' })
            }

            const designationName = request.body.designationName
            const vineyardName = request.body.vineyardName
            const vintageName = request.body.vintageName
            const bottleNameName = request.body.bottleNameName
            const bottleSizeName = request.body.bottleSizeName
            const wineTypeName = request.body.wineTypeName

            const bottle = await bottleController.update(bottleId, designationName, vineyardName, vintageName, bottleNameName, bottleSizeName, wineTypeName)

            bottle == 0 ? response.sendStatus(404) : response.sendStatus(204)
        } catch (error) {
            return error
        }
    })

    /**
     * DELETE FROM table WHERE id = ?
     */
    router.delete(CONSTANTS.ROOT.ACTION.DELETE + CONSTANTS.ROOT.PARAM.ID, [authJwt.verifyToken, authJwt.isAdmin], async (request, response) => {
        try {
            await bottleController.delete(request.params.id)
            response.sendStatus(204)    // Deleted.
        } catch (error) {
            return error
        }
    })

    /**
     * DELETE FROM table WHERE id = ?
     * Delete a bottle stored in an compartment.
     */
    router.delete(CONSTANTS.ROOT.ACTION.DELETE + CONSTANTS.ROOT.PARAM.ID + CONSTANTS.ROOT.PARAM.COMPARTMENT_ID
        ,[authJwt.verifyToken], async (request, response) => {
            try {
                const bottle = await bottleController.deleteByCompartment(request.params.id, request.params.compartmentId, request.userId)

                if (bottle.Unauthorized) {
                    response.status(401).send(bottle)    // Unauthorized: "User doesn't own the compartment. "
                }
                else {
                    response.sendStatus(204)    // Deleted.
                }
            } catch (error) {
                return error
            }
        })

    return router
}

/**
 * Function called for find all bottles for a user. Can have an order or not.
 *
 * @param response
 * @param userId
 * @param order Can be undefined.
 * @param direction Can be undefined.
 * @returns {Promise<*>}
 */
async function requestFindAllByUser (response, userId, order, direction) {
    try {
        const bottle = await bottleController.findAllByUser(userId, order, direction)

        if (bottle) {
            response.status(200).send(bottle)
        }
        else {
            response.status(500).send(bottle)
        }
    }
    catch (error) {
        return error
    }
}
