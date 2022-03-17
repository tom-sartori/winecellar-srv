const express = require('express')
const router = express.Router()

const CONSTANTS = include('config/constants')

const utilisateurController = include('controllers/utilisateur/utilisateur.controller')

/**
 * Connect all routes to controller actions.
 */
module.exports = app => {

    /**
     * INSERT INTO table (name) VALUES (?) RETURNING id, name
     */
    router.post(CONSTANTS.ROOT.ACTION.CREATE, async (request, response) => {
        try {
            response.send(await utilisateurController.create(request.body))
        } catch (error) {
            return error
        }
    })

    /**
     * SELECT *
     */
    router.get(CONSTANTS.ROOT.ACTION.FIND_ALL, async (request, response) => {
        try {
            response.send(await utilisateurController.findAll())
        }
        catch (error) {
            return error
        }
    })

    /**
     * SELECT * WHERE id = ?
     */
    router.get(CONSTANTS.ROOT.ACTION.FIND_BY_PK_BODY, async (request, response) => {
        try {
            const utilisateur = await utilisateurController.findByPk(request.body)
            utilisateur === null ? response.sendStatus(204) : response.send(utilisateur)
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
            response.send(await utilisateurController.update(request.body))
        } catch (error) {
            return error
        }
    })

    /**
     * DELETE FROM table WHERE id = ?
     */
    router.delete(CONSTANTS.ROOT.ACTION.DELETE, async (request, response) => {
        try {
            response.send(await utilisateurController.delete(request.body))
        } catch (error) {
            return error
        }
    })

    return router
}
