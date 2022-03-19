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
            CAVE: {
                CAVE: '/caves',
                MUR: '/murs',
                EMPLACEMENT: '/emplacements'
            },
            UTILISATEUR: {
                UTILISATEUR: '/utilisateurs',
                ROLE_UTILISATEUR: '/role-utilisateurs',
                AUTHENTICATION: '/auth',
                TEST: '/test'
            }
        },
        ACTION: {
            CREATE: '/create',
            FIND_ALL: '',
            FIND_BY_PK: '',
            FIND_BY_PK_BODY: '/find',
            UPDATE: '/update',
            DELETE: '/delete',
            SIGNUP: '/signup',
            SIGNIN: '/signin',
            REFRESH_TOKEN: '/refreshtoken'
        },
        PARAM: {
            ID: '/id/:id',
            NAME: '/name/:name',
            EMAIL: 'email/:email'
        }
    },
    AUTHENTICATION: {
        ROLES: ['user', 'admin']
    }
}
