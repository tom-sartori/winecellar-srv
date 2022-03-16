const PORT = process.env.PORT || 3000

const config = include('config/config')
const Sequelize = require('sequelize')
const sequelize = new Sequelize(config.postgres.options)

// Launch the db.
function connectToPostgres () {
    sequelize.authenticate()
        .then(() => console.log('Connected to db. '))
        .catch((error) => {
            console.log('Error while connecting to the db : ', error.message)
            process.exit(1)
        })
    return sequelize
}
config.postgres.client = connectToPostgres()

// Launch the server.
module.exports = (server) => {
    // Launch server.
    server.listen(PORT)
    server.on('listening', () => {
        console.log(`App running on port ${PORT}. http://localhost:${PORT}`)
    })
}
