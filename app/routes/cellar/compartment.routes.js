const express = require('express')
const router = express.Router()

const CONSTANTS = include('config/constants')
const { authJwt } = include("middleware")

const compartmentController = include('controllers/cellar/compartment.controller')

/**
 * Connect all routes to controller actions.
 */
module.exports = app => {

    /**
     * INSERT INTO table (name) VALUES (?) RETURNING id, name
     */
    router.post(CONSTANTS.ROOT.ACTION.CREATE, [authJwt.verifyToken], async (request, response) => {
        try {
            const wallId = request.body.wallId
            const listPoint = request.body.points
            if (wallId === undefined  || listPoint === undefined) {
                response.sendStatus(400)
            }

            const compartment = await compartmentController.create(wallId, listPoint, request.userId)

            if (compartment.Unauthorized) {
                response.status(401).send(compartment)    // Unauthorized: "User doesn't own the wall. "
            }
            else if (compartment.errors) {
                response.status(400)    // Error.
                response.send(compartment.errors.message)
            }
            if (compartment.parent) {
                response.status(400)    // wallId not created.
                response.send(compartment.parent.detail)
            }
            else {
                response.status(201)    // Created.
                response.send(compartment)
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
            response.send(await compartmentController.findAll())
        }
        catch (error) {
            return error
        }
    })

    /**
     * SELECT * By wall.
     */
    router.get(CONSTANTS.ROOT.ACTION.FIND_ALL + CONSTANTS.ROOT.PARAM.WALL_ID, [authJwt.verifyToken], async (request, response) => {
        try {
            const compartment = await compartmentController.findAllByWall(request.params.wallId, request.userId)

            if (compartment.Unauthorized) {
                response.status(401).send(compartment)    // Unauthorized: "User doesn't own the wall. "
            }
            else {
                response.send(compartment)
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
            const compartment = await compartmentController.findByPk(request.params.id)
            compartment === null ? response.sendStatus(204) : response.send(compartment)
        }
        catch (error) {
            return error
        }
    })

    /**
     * Add or remove a bottle from an compartment.
     */
    router.put(CONSTANTS.ROOT.ACTION.UPDATE, [authJwt.verifyToken], async (request, response) => {
        try {
            if (request.body.compartmentId === undefined ||
                request.body.bottleId === undefined ||
                request.body.quantity === undefined) {
                response.sendStatus(400)    // Bad request
                return
            }

            const compartment = await compartmentController.update(request.body.compartmentId, request.body.bottleId, request.body.quantity, request.userId)

            if (compartment.Unauthorized) {
                response.status(401).send(compartment)    // Unauthorized: "User doesn't own the wall. "
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
            const compartment = await compartmentController.delete(request.params.id, request.userId)

            if (compartment.Unauthorized) {
                response.status(401).send(compartment)    // Unauthorized: "User doesn't own the wall. "
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
