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
     */
    router.post(CONSTANTS.ROOT.ACTION.CREATE, [authJwt.verifyToken], async (request, response) => {
        try {
            const bouteille = await bouteilleController.create(request.body)
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
            const bouteille = await bouteilleController.findAllByEmplacement(request.params.id, request.userId)

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

    return router
}
