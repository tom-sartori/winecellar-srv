const express = require('express')
const router = express.Router()

const CONSTANTS = include('config/constants')

const appellationController = include('controllers/bouteille/appellation.controller')

/**
 * Connect all routes to controller actions.
 */
module.exports = app => {

    // Create.
    router.post(CONSTANTS.ROOT.ACTION.CREATE, async (request, response) => {
        try {
            response.send(await appellationController.create(request.body))
        } catch (error) {
            return error
        }
    })

    // Find all.
    router.get(CONSTANTS.ROOT.ACTION.FIND_ALL, async (request, response) => {
        try {
            response.send(await appellationController.findAll())
        }
        catch (error) {
            return error
        }
    })

    // Find one by id.
    router.get(
        CONSTANTS.ROOT.ACTION.FIND_BY_PK +
        CONSTANTS.ROOT.PARAM.ID
        , async (request, response) => {
            try {
                response.send(await appellationController.findByPk(request.params.id))
            }
            catch (error) {
                return error
            }
        })

    // Update.
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

    // Delete.
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
