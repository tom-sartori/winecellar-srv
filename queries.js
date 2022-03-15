const { client } = require('./config')

const getAppellation = (request, response) => {
    client.connect(err => {
        if (err) {
            console.error('connection error', err.stack)
        }
        else  {
            console.log('Connected to db')
            client.query('SELECT * FROM appellation ORDER BY 2 ASC;', (error, results) => {
                if (error)
                    throw error;

                response.status(200).json(results.rows)
                client.end();
            });
        }
    });
}

module.exports = {
    getAppellation
}
