const express = require('express')
const router = express.Router()

const CONSTANTS = include('config/constants')
const { authJwt } = include("middleware")

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
            const utilisateur = await utilisateurController.create(request.body)

            if (utilisateur.errors) {
                response.status(400)    // Error. Often email constraint violation.
                response.send(utilisateur.errors.message)
            }
            else {  // Created.
                response.status(201)    // Created.
                response.send(utilisateur)
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
            response.send(await utilisateurController.findAll())
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
            const utilisateurId = request.params.id

            if (utilisateurId === undefined){
                response.sendStatus(400)
                return
            }
            if (utilisateurId !== request.userId) {
                response.sendStatus(401)    // The user which request has to be the requested.
                return
            }

            const utilisateur = await utilisateurController.findByPk(utilisateurId)
            utilisateur === null ? response.sendStatus(204) : response.send(utilisateur)
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
            const utilisateur = await utilisateurController.update(request.body)
            utilisateur == 0 ? response.sendStatus(404) : response.sendStatus(204)
        } catch (error) {
            return error
        }
    })

    /**
     * Promote user to role admin.
     */
    router.put(CONSTANTS.ROOT.ACTION.PROMOTE, [authJwt.verifyToken, authJwt.isAdmin], async (request, response) => {
        try {
            const utilisateurId = request.body.id
            const username = request.body.username
            const email = request.body.email

            if (utilisateurId === undefined || username === undefined || email === undefined){
                response.sendStatus(400)
                return
            }

            const utilisateur = await utilisateurController.promoteAdmin(utilisateurId, username, email)
            utilisateur === undefined ? response.sendStatus(204) : response.status(500).send(utilisateur)
        } catch (error) {
            return error
        }
    })

    /**
     * DELETE FROM table WHERE id = ?
     */
    router.delete(CONSTANTS.ROOT.ACTION.DELETE, [authJwt.verifyToken, authJwt.isAdmin], async (request, response) => {
        try {
            const utilisateurId = request.body.id
            const username = request.body.username
            const email = request.body.email

            if (utilisateurId === undefined || username === undefined || email === undefined){
                response.sendStatus(400)
                return
            }

            await utilisateurController.delete(utilisateurId, username, email)
            response.sendStatus(204)    // Deleted.
        } catch (error) {
            return error
        }
    })

    return router
}
