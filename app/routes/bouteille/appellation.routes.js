const express = require('express')
const router = express.Router()

const CONSTANTS = include('config/constants')

const appellationController = include('controllers/bouteille/appellation.controller')

/**
 * Connect all routes to controller actions.
 */
module.exports = app => {

    /**
     * INSERT INTO table (name) VALUES (?) RETURNING id, name
     */
    router.post(CONSTANTS.ROOT.ACTION.CREATE, async (request, response) => {
        try {
            response.send(await appellationController.create(request.body))
        } catch (error) {
            return error
        }
    })

    /**
     * SELECT *
     */
    router.get(CONSTANTS.ROOT.ACTION.FIND_ALL, async (request, response) => {
        try {
            response.send(await appellationController.findAll())
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
                const appellation = await appellationController.findByPk(request.params.id)
                appellation === null ? response.sendStatus(204) : response.send(appellation)
            }
            catch (error) {
                return error
            }
        })

    /**
     * UPDATE table SET name = ? WHERE id = ?
     */
    router.put(
        CONSTANTS.ROOT.ACTION.UPDATE +
        CONSTANTS.ROOT.PARAM.ID +
        CONSTANTS.ROOT.PARAM.NAME
        , async (request, response) => {
            try {
                response.send(await appellationController.update(request.params.id, request.params.name))
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
                response.send(await appellationController.delete(request.params.id))
            } catch (error) {
                return error
            }
        })

    return router
}
