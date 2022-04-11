/**
 * Set all global constants.
 */

module.exports = {
    ROOT: {
        API: '/api',
        OBJECT: {
            BOTTLE: {
                BOTTLE: '/bottles',
                DESIGNATION: '/designations',
                VINEYARD: '/vineyards',
            },
            CELLAR: {
                CELLAR: '/cellars',
                WALL: '/walls',
                COMPARTMENT: '/compartments'
            },
            USER: {
                USER: '/users',
                ROLE: '/role',
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
            CELLAR_ID: '/cellar-id/:cellarId',
            COMPARTMENT_ID: '/compartment-id/:compartmentId',
            WALL_ID: '/wall-id/:wallId',
            ORDER: '/order/:order',
            DIRECTION: '/direction/:direction'
        },
        IMAGE: {
            WALL_IMAGE_PATH: '/wall-image'
        }
    },
    AUTHENTICATION: {
        ROLES: ['user', 'admin']
    }
}
