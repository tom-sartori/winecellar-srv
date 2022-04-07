const express = require('express')
const router = express.Router()

const CONSTANTS = include('config/constants')
const { authJwt } = include("middleware")

const cellarController = include('controllers/cellar/cellar.controller')

/**
 * Connect all routes to controller actions.
 */
module.exports = app => {

    /**
     * INSERT INTO table (name) VALUES (?) RETURNING id, name
     */
    router.post(CONSTANTS.ROOT.ACTION.CREATE, [authJwt.verifyToken], async (request, response) => {
        try {
            const cellar = await cellarController.create(request.body.name, request.userId)

            if (cellar.errors) {
                response.status(400)    // Created.
                response.send(cellar.errors.message)
            }
            else {
                response.status(201)    // Created.
                response.send(cellar)
            }
        } catch (error) {
            return error
        }
    })

    /**
     * SELECT *
     */
    router.get(CONSTANTS.ROOT.ACTION.FIND_ALL, [authJwt.verifyToken], async (request, response) => {
        try {
            response.send(await cellarController.findAll(request.userId))
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
                const cellar = await cellarController.findByPk(request.params.id)
                cellar === null ? response.sendStatus(204) : response.send(cellar)
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
            const designation = await cellarController.update(request.body)
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
                await cellarController.delete(request.params.id)
                response.sendStatus(204)    // Deleted.
            } catch (error) {
                return error
            }
        })

    return router
}
