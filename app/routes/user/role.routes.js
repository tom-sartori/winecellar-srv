const express = require('express')
const router = express.Router()

const CONSTANTS = include('config/constants')

const roleController = include('controllers/bottle/role.controller')

/**
 * Connect all routes to controller actions.
 */
module.exports = app => {

    /**
     * INSERT INTO table (name) VALUES (?) RETURNING id, name
     */
    router.post(CONSTANTS.ROOT.ACTION.CREATE, async (request, response) => {
        try {
            response.status(201)    // Created.
            response.send(await roleController.create(request.body))
        } catch (error) {
            return error
        }
    })

    /**
     * SELECT *
     */
    router.get(CONSTANTS.ROOT.ACTION.FIND_ALL, async (request, response) => {
        try {
            response.send(await roleController.findAll())
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
                const role = await roleController.findByPk(request.params.id)
                role === null ? response.sendStatus(204) : response.send(role)
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
            const designation = await roleController.update(request.body)
            designation == 0 ? response.sendStatus(404) : response.sendStatus(204)
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
                await roleController.delete(request.params.id)
                response.sendStatus(204)    // Deleted.
            } catch (error) {
                return error
            }
        })

    return router
}
