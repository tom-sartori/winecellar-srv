/**
 * Set all global constants.
 */

module.exports = {
    ROOT: {
        API: '/api',
        OBJECT: {
            BOUTEILLE: {
                APPELLATION: '/appellations',
                DOMAINE: '/domaines'
            }
        },
        ACTION: {
            CREATE: '/create',
            FIND_ALL: '/',
            FIND_BY_PK: '',
            UPDATE: '/update',
            DELETE: '/delete'
        },
        PARAM: {
            ID: '/id/:id',
            NAME: '/name/:name'
        }
    }
}
