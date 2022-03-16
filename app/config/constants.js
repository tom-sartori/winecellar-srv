/**
 * Set all global constants.
 */

module.exports = {
    ROOT: {
        API: '/api',
        MODEL: {
            APPELLATION: '/appellations'
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
