const Pool = require('pg').Pool

const pool = new Pool({
    user: 'admin',
    host: 'localhost',
    database: 'winecellar',
    password: 'admin',
    port: 5432,
})

const getAppellation = (request, response) => {
    pool.query('SELECT * FROM appellation ORDER BY 2 ASC', (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}


module.exports = {
    getAppellation
}
