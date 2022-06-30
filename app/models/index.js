const Sequelize = require("sequelize")
const config = include('config/config')

const CONSTANTS = include('config/constants')

const postgresClient = config.postgres.client

// Re-sync the db.
postgresClient.sync({  })  // alter: true
    .then(() => {
        console.log("Drop and re-sync db.")
        include('models/initialisation')
    })
    .catch((error) => {
        console.log('Error while syncing the db : ' + error)
        process.exit(1)
    })
// postgresClient.sync({ force: true })  // alter: true
//     .then(() => {
//         console.log("Drop and re-sync db.")
//         // include('models/initialisation')
//     })
//     .catch((error) => {
//         console.log('Error while syncing the db : ' + error)
//         process.exit(1)
//     })


/**
 * Get models to create db foreign keys.
 */

// Bottle.
const bottleModel = include('models/bottle/bottle.model')(postgresClient)
const designationModel = include('models/bottle/designation.model')(postgresClient)
const vineyardModel = include('models/bottle/vineyard.model')(postgresClient)
const vintageModel = include('models/bottle/vintage.model')(postgresClient)
const bottleNameModel = include('models/bottle/bottleName.model')(postgresClient)
const bottleSizeModel = include('models/bottle/bottleSize.model')(postgresClient)
const wineTypeModel = include('models/bottle/wineType.model')(postgresClient)

// Cellar.
const cellarModel = include('models/cellar/cellar.model')(postgresClient)
const compartmentModel = include('models/cellar/compartment.model')(postgresClient)
const compartmentBottleModel = include('models/cellar/compartmentBottle.model')(postgresClient)
const wallModel = include('models/cellar/wall.model')(postgresClient)
const pointModel = include('models/cellar/point.model')(postgresClient)

// User.
const userModel = include('models/user/user.model')(postgresClient)
const roleModel = include('models/user/role.model')(postgresClient)
const refreshTokenModel = include('models/user/refreshToken.model')(postgresClient)


/**
 * Foreign keys creation.
 */

// Bottle.
designationModel.hasMany(bottleModel, { foreignKey: { allowNull: false } })
bottleModel.belongsTo(designationModel)

vineyardModel.hasMany(bottleModel, { foreignKey: { allowNull: false } })
bottleModel.belongsTo(vineyardModel)

vintageModel.hasMany(bottleModel, { foreignKey: { allowNull: false } })
bottleModel.belongsTo(vintageModel)

bottleNameModel.hasMany(bottleModel, { foreignKey: { allowNull: false } })
bottleModel.belongsTo(bottleNameModel)

bottleSizeModel.hasMany(bottleModel, { foreignKey: { allowNull: false } })
bottleModel.belongsTo(bottleSizeModel)

wineTypeModel.hasMany(bottleModel, { foreignKey: { allowNull: false } })
bottleModel.belongsTo(wineTypeModel)

// Association bottle cellar.
bottleModel.belongsToMany(compartmentModel, { through: compartmentBottleModel })
compartmentModel.belongsToMany(bottleModel, { through: compartmentBottleModel })

// Cellar.
cellarModel.hasMany(wallModel, { foreignKey: { allowNull: false } })
wallModel.belongsTo(cellarModel)

wallModel.hasMany(compartmentModel, { foreignKey: { allowNull: false } })
compartmentModel.belongsTo(wallModel)

compartmentModel.hasMany(pointModel, { foreignKey: { allowNull: false } })
pointModel.belongsTo(compartmentModel)

// Association cellar user.
cellarModel.belongsToMany(userModel, { through: 'cellarUser' })
userModel.belongsToMany(cellarModel, { through: 'cellarUser' })

// User.
userModel.belongsToMany(roleModel, { through: 'userRole', timestamps: false })
roleModel.belongsToMany(userModel, { through: 'userRole', timestamps: false })

userModel.hasOne(refreshTokenModel)
refreshTokenModel.belongsTo(userModel)


// Export models.
module.exports = {
    Sequelize: Sequelize,
    postgresClient: postgresClient,

    // Bottle.
    bottleModel: bottleModel,
    designationModel: designationModel,
    vineyardModel: vineyardModel,
    vintageModel: vintageModel,
    bottleNameModel: bottleNameModel,
    bottleSizeModel: bottleSizeModel,
    wineTypeModel: wineTypeModel,

    // Cellar.
    cellarModel: cellarModel,
    wallModel: wallModel,
    compartmentModel: compartmentModel,
    compartmentBottleModel: compartmentBottleModel,
    pointModel: pointModel,

    // User
    userModel: userModel,
    roleModel : roleModel,
    refreshTokenModel: refreshTokenModel,
    ROLES: CONSTANTS.AUTHENTICATION.ROLES
}
