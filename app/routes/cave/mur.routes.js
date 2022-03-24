const express = require('express')
const router = express.Router()

const { authJwt } = include("middleware")
const upload = include('middleware/upload')
const CONSTANTS = include('config/constants')
const murController = include('controllers/cave/mur.controller')


/**
 * Connect all routes to controller actions.
 */
module.exports = app => {

    /**
     * INSERT INTO table (name) VALUES (?) RETURNING id, name
     */
    router.post(CONSTANTS.ROOT.ACTION.CREATE, upload.single('image'), async (request, response) => {
        try {
            const filePath = request.file.filename
            const mur = await murController.create(request.body.caveId, filePath)

            if (mur.errors) {
                console.log(mur.errors)
                response.status(400)    // Error.
                response.send(mur.errors.message)
            }
            if (mur.parent) {
                console.log(mur.parent)
                response.status(400)    // TableId not created.
                response.send(mur.parent.detail)
            }
            else {
                response.status(201)    // Created.
                response.send(mur)
            }
        } catch (error) {
            return error
        }
    })

    /**
     * SELECT *
     */
    router.get(CONSTANTS.ROOT.ACTION.FIND_ALL, async (request, response) => {
        try {
            response.send(await murController.findAll())
        }
        catch (error) {
            return error
        }
    })

    /**
     * Return every 'mur' that are in the 'caveId'.
     * Also check that the user who requested own the cave.
     * @param caveId
     * @returns {Promise<*|*>}
     */
    router.get(CONSTANTS.ROOT.ACTION.FIND_ALL + CONSTANTS.ROOT.PARAM.CAVE_ID, [authJwt.verifyToken], async (request, response) => {
        try {
            const mur = await murController.findAllFromCaveId(request.params.id, request.userId)

            if (mur) {
                response.status(200).send(mur)
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
        CONSTANTS.ROOT.ACTION.FIND_BY_PK +
        CONSTANTS.ROOT.PARAM.ID
        , async (request, response) => {
            try {
                const mur = await murController.findByPk(request.params.id)
                mur === null ? response.sendStatus(204) : response.send(mur)
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
            const appellaiton = await murController.update(request.body)
            appellaiton == 0 ? response.sendStatus(404) : response.sendStatus(204)
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
                await murController.delete(request.params.id)
                response.sendStatus(204)    // Deleted.
            } catch (error) {
                return error
            }
        })

    return router
}
