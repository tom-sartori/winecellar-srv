const express = require('express')
const router = express.Router()

const CONSTANTS = include('config/constants')

const roleUtilisateurController = include('controllers/bouteille/roleUtilisateur.controller')

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
            response.send(await roleUtilisateurController.create(request.body))
        } catch (error) {
            return error
        }
    })

    /**
     * SELECT *
     */
    router.get(CONSTANTS.ROOT.ACTION.FIND_ALL, async (request, response) => {
        try {
            response.send(await roleUtilisateurController.findAll())
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
                const roleUtilisateur = await roleUtilisateurController.findByPk(request.params.id)
                roleUtilisateur === null ? response.sendStatus(204) : response.send(roleUtilisateur)
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
            const appellaiton = await roleUtilisateurController.update(request.body)
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
                await roleUtilisateurController.delete(request.params.id)
                response.sendStatus(204)    // Deleted.
            } catch (error) {
                return error
            }
        })

    return router
}
