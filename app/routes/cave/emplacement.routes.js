const express = require('express')
const router = express.Router()

const CONSTANTS = include('config/constants')
const { authJwt } = include("middleware")

const emplacementController = include('controllers/cave/emplacement.controller')

/**
 * Connect all routes to controller actions.
 */
module.exports = app => {

    /**
     * INSERT INTO table (name) VALUES (?) RETURNING id, name
     */
    router.post(CONSTANTS.ROOT.ACTION.CREATE, [authJwt.verifyToken], async (request, response) => {
        try {
            const murId = request.body.murId
            const listPoint = request.body.points
            if (murId === undefined  || listPoint === undefined) {
                response.sendStatus(400)
            }

            const emplacement = await emplacementController.create(murId, listPoint, request.userId)

            if (emplacement.Unauthorized) {
                response.status(401).send(emplacement)    // Unauthorized: "User doesn't own the mur. "
            }
            else if (emplacement.errors) {
                response.status(400)    // Error.
                response.send(emplacement.errors.message)
            }
            if (emplacement.parent) {
                response.status(400)    // murId not created.
                response.send(emplacement.parent.detail)
            }
            else {
                response.status(201)    // Created.
                response.send(emplacement)
            }
        } catch (error) {
            return error
        }
    })

    /**
     * SELECT *
     */
    router.get(CONSTANTS.ROOT.ACTION.FIND_ALL, [authJwt.verifyToken, authJwt.isAdmin], async (request, response) => {
        try {
            response.send(await emplacementController.findAll())
        }
        catch (error) {
            return error
        }
    })

    /**
     * SELECT * By mur.
     */
    router.get(CONSTANTS.ROOT.ACTION.FIND_ALL + CONSTANTS.ROOT.PARAM.MUR_ID, [authJwt.verifyToken], async (request, response) => {
        try {
            const emplacement = await emplacementController.findAllByMur(request.params.murId, request.userId)

            if (emplacement.Unauthorized) {
                response.status(401).send(emplacement)    // Unauthorized: "User doesn't own the mur. "
            }
            else {
                response.send(emplacement)
            }
        }
        catch (error) {
            return error
        }
    })

    /**
     * SELECT * WHERE id = ?
     */
    router.get(CONSTANTS.ROOT.ACTION.FIND_BY_PK + CONSTANTS.ROOT.PARAM.ID, [authJwt.verifyToken, authJwt.isAdmin], async (request, response) => {
        try {
            const emplacement = await emplacementController.findByPk(request.params.id)
            emplacement === null ? response.sendStatus(204) : response.send(emplacement)
        }
        catch (error) {
            return error
        }
    })

    /**
     * Add or remove a bottle from an emplacement.
     */
    router.put(CONSTANTS.ROOT.ACTION.UPDATE, [authJwt.verifyToken], async (request, response) => {
        try {
            if (request.body.emplacementId === undefined ||
                request.body.bouteilleId === undefined ||
                request.body.quantity === undefined) {
                response.sendStatus(400)    // Bad request
                return
            }

            const emplacement = await emplacementController.update(request.body.emplacementId, request.body.bouteilleId, request.body.quantity, request.userId)

            if (emplacement.Unauthorized) {
                response.status(401).send(emplacement)    // Unauthorized: "User doesn't own the mur. "
            }
            else {
                response.sendStatus(204)    // Updated
            }
        } catch (error) {
            return error
        }
    })

    /**
     * DELETE FROM table WHERE id = ?
     */
    router.delete(CONSTANTS.ROOT.ACTION.DELETE + CONSTANTS.ROOT.PARAM.ID, [authJwt.verifyToken], async (request, response) => {
        try {
            const emplacement = await emplacementController.delete(request.params.id, request.userId)

            if (emplacement.Unauthorized) {
                response.status(401).send(emplacement)    // Unauthorized: "User doesn't own the mur. "
            }
            else {
                response.sendStatus(204)    // Deleted
            }
        } catch (error) {
            return error
        }
    })

    return router
}
