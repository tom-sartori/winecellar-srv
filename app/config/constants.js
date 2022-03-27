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
            ALL: '/all',
            FIND_ALL: '',
            FIND_BY_PK: '',
            FIND_BY_PK_BODY: '/find',
            UPDATE: '/update',
            PROMOTE: '/promote',
            DELETE: '/delete',
            SIGNUP: '/signup',
            SIGNIN: '/signin',
            REFRESH_TOKEN: '/refreshtoken'
        },
        PARAM: {
            ID: '/id/:id',
            NAME: '/name/:name',
            EMAIL: '/email/:email',
            CAVE_ID: '/cave-id/:id',
            EMPLACEMENT_ID: '/emplacement-id/:emplacementId',
            MUR_ID: '/mur-id/:murId'
        },
        IMAGE: {
            MUR_IMAGE_PATH: '/mur-image'
        }
    },
    AUTHENTICATION: {
        ROLES: ['user', 'admin']
    }
}
