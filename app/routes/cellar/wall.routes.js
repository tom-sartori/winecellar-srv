const express = require('express')
const router = express.Router()

const { authJwt } = include("middleware")
const upload = include('middleware/upload')
const CONSTANTS = include('config/constants')
const wallController = include('controllers/cellar/wall.controller')


/**
 * Connect all routes to controller actions.
 */
module.exports = app => {

    /**
     * INSERT INTO table (name) VALUES (?) RETURNING id, name
     */
    router.post(CONSTANTS.ROOT.ACTION.CREATE, upload.single('image'), [authJwt.verifyToken], async (request, response) => {
        try {
            const filePath = request.file.filename
            const wall = await wallController.create(request.body.cellarId, filePath, request.userId)

            if (wall.Unauthorized) {
                response.status(401).send(wall)    // Unauthorized: "User doesn't own the cellar. "
            }
            else if (wall.errors) {
                response.status(400)    // Error.
                response.send(wall.errors.message)
            }
            if (wall.parent) {
                response.status(400)    // TableId not created.
                response.send(wall.parent.detail)
            }
            else {
                response.status(201)    // Created.
                response.send(wall)
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
            response.send(await wallController.findAll())
        }
        catch (error) {
            return error
        }
    })

    /**
     * Return every 'wall' that are in the 'cellarId'.
     * Also check that the user who requested own the cellar.
     * @param cellarId
     * @returns {Promise<*|*>}
     */
    router.get(CONSTANTS.ROOT.ACTION.FIND_ALL + CONSTANTS.ROOT.PARAM.CELLAR_ID, [authJwt.verifyToken], async (request, response) => {
        try {
            const wall = await wallController.findAllFromCellarId(request.params.cellarId, request.userId)

            if (wall) {
                response.status(200).send(wall)
            }
            else {
                response.sendStatus(403)    // User not authorized.
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
        CONSTANTS.ROOT.ACTION.FIND_BY_PK + CONSTANTS.ROOT.PARAM.ID, [authJwt.verifyToken, authJwt.isAdmin], async (request, response) => {
            try {
                const wall = await wallController.findByPk(request.params.id)
                wall === null ? response.sendStatus(204) : response.send(wall)
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
            const designation = await wallController.update(request.body)
            designation == 0 ? response.sendStatus(404) : response.sendStatus(204)
        } catch (error) {
            return error
        }
    })

    /**
     * DELETE FROM table WHERE id = ?
     */
    router.delete(CONSTANTS.ROOT.ACTION.DELETE + CONSTANTS.ROOT.PARAM.ID, [authJwt.verifyToken], async (request, response) => {
        try {
            const wall = await wallController.delete(request.params.id, request.userId)

            if (wall.Unauthorized) {
                response.status(401).send(wall)    // Unauthorized: "User doesn't own the wall. "
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
