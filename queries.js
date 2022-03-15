const { client } = require('./config')

const getAppellation = (request, response) => {
    client.query('SELECT * FROM appellation ORDER BY 2 ASC;', (error, results) => {
        if (error)
            throw error;

        response.status(200).json(results.rows)
    });
}

module.exports = {
    getAppellation
}
