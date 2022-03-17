const Sequelize = require("sequelize")
const config = include('config/config')

const postgresClient = config.postgres.client

// TODO : if dev mode
// Re-sync the db.
postgresClient.sync({force: true})  // alter: true
    .then(() => console.log("Drop and re-sync db."))
    .catch((error) => {
        console.log('Error while syncing the db : ' + error.message)
        process.exit(1)
    })

module.exports = {
    Sequelize: Sequelize,
    postgresClient: postgresClient,
    appellationModel: include('models/bouteille/appellation.model')(postgresClient),
}
