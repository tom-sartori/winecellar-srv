const express = require('express')
const router = express.Router()

const CONSTANTS = include('config/constants')
const { authJwt } = include("middleware")

const userController = include('controllers/user/user.controller')

/**
 * Connect all routes to controller actions.
 */
module.exports = app => {

    /**
     * INSERT INTO table (name) VALUES (?) RETURNING id, name
     */
    router.post(CONSTANTS.ROOT.ACTION.CREATE, async (request, response) => {
        try {
            const user = await userController.create(request.body)

            if (user.errors) {
                response.status(400)    // Error. Often email constraint violation.
                response.send(user.errors.message)
            }
            else {  // Created.
                response.status(201)    // Created.
                response.send(user)
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
            response.send(await userController.findAll())
        }
        catch (error) {
            return error
        }
    })

    /**
     * SELECT * WHERE id = ?
     */
    router.get(CONSTANTS.ROOT.ACTION.FIND_BY_PK_BODY + CONSTANTS.ROOT.PARAM.ID,[authJwt.verifyToken], async (request, response) => {
        try {
            const userId = request.params.id

            if (userId === undefined){
                response.sendStatus(400)
                return
            }
            if (userId !== request.userId) {
                response.sendStatus(401)    // The user which request has to be the requested.
                return
            }

            const user = await userController.findByPk(userId)
            user === null ? response.sendStatus(204) : response.send(user)
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
            const user = await userController.update(request.body)
            user == 0 ? response.sendStatus(404) : response.sendStatus(204)
        } catch (error) {
            return error
        }
    })

    /**
     * Promote user to role admin.
     */
    router.put(CONSTANTS.ROOT.ACTION.PROMOTE, [authJwt.verifyToken, authJwt.isAdmin], async (request, response) => {
        try {
            const userId = request.body.id
            const username = request.body.username
            const email = request.body.email

            if (userId === undefined || username === undefined || email === undefined){
                response.sendStatus(400)
                return
            }

            const user = await userController.promoteAdmin(userId, username, email)
            user === undefined ? response.sendStatus(204) : response.status(500).send(user)
        } catch (error) {
            return error
        }
    })

    /**
     * DELETE FROM table WHERE id = ?
     */
    router.delete(CONSTANTS.ROOT.ACTION.DELETE, [authJwt.verifyToken, authJwt.isAdmin], async (request, response) => {
        try {
            const userId = request.body.id
            const username = request.body.username
            const email = request.body.email

            if (userId === undefined || username === undefined || email === undefined){
                response.sendStatus(400)
                return
            }

            await userController.delete(userId, username, email)
            response.sendStatus(204)    // Deleted.
        } catch (error) {
            return error
        }
    })

    return router
}
