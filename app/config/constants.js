/**
 * Set all global constants.
 */

module.exports = {
    ROOT: {
        API: '/api',
        OBJECT: {
            BOUTEILLE: {
                BOUTEILLE: '/bouteilles',
                APPELLATION: '/appellations',
                DOMAINE: '/domaines',
                TYPE_VIN: '/type-vin'
            },
            UTILISATEUR: {
                UTILISATEUR: '/utilisateurs',
                ROLE_UTILISATEUR: '/role-utilisateurs'
            }
        },
        ACTION: {
            CREATE: '/create',
            FIND_ALL: '',
            FIND_BY_PK: '',
            FIND_BY_PK_BODY: '/find',
            UPDATE: '/update',
            DELETE: '/delete'
        },
        PARAM: {
            ID: '/id/:id',
            NAME: '/name/:name',
            EMAIL: 'email/:email'
        }
    }
}
