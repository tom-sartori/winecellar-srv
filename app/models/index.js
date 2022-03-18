const Sequelize = require("sequelize")
const config = include('config/config')

const postgresClient = config.postgres.client

// TODO : if dev mode
// Re-sync the db.
postgresClient.sync({ force: true })  // alter: true
    .then(() => console.log("Drop and re-sync db."))
    .catch((error) => {
        console.log('Error while syncing the db : ' + error)
        process.exit(1)
    })


/**
 * Get models to create db foreign keys.
 */

// Bouteille.
const bouteilleModel = include('models/bouteille/bouteille.model')(postgresClient)
const appellationModel = include('models/bouteille/appellation.model')(postgresClient)
const domaineModel = include('models/bouteille/domaine.model')(postgresClient)
const millesimeModel = include('models/bouteille/millesime.model')(postgresClient)
const nomBouteilleModel = include('models/bouteille/nomBouteille.model')(postgresClient)
const tailleBouteilleModel = include('models/bouteille/tailleBouteille.model')(postgresClient)
const typeVinModel = include('models/bouteille/typeVin.model')(postgresClient)

// Cave.
const caveModel = include('models/cave/cave.model')(postgresClient)
const emplacementModel = include('models/cave/emplacement.model')(postgresClient)
const murModel = include('models/cave/mur.model')(postgresClient)
const pointModel = include('models/cave/point.model')(postgresClient)

// Utilisateur.
const utilisateurModel = include('models/utilisateur/utilisateur.model')(postgresClient)


/**
 * Foreign keys creation.
 */

// Bouteille.
appellationModel.hasMany(bouteilleModel, { foreignKey: { allowNull: false } })
bouteilleModel.belongsTo(appellationModel)

domaineModel.hasMany(bouteilleModel, { foreignKey: { allowNull: false } })
bouteilleModel.belongsTo(domaineModel)

millesimeModel.hasMany(bouteilleModel, { foreignKey: { allowNull: false } })
bouteilleModel.belongsTo(millesimeModel)

nomBouteilleModel.hasMany(bouteilleModel, { foreignKey: { allowNull: false } })
bouteilleModel.belongsTo(nomBouteilleModel)

tailleBouteilleModel.hasMany(bouteilleModel, { foreignKey: { allowNull: false } })
bouteilleModel.belongsTo(tailleBouteilleModel)

typeVinModel.hasMany(bouteilleModel, { foreignKey: { allowNull: false } })
bouteilleModel.belongsTo(typeVinModel)

// Association bouteille cave.
bouteilleModel.belongsToMany(emplacementModel, { through: 'BouteilleEmplacement' })
emplacementModel.belongsToMany(bouteilleModel, { through: 'BouteilleEmplacement' })

// Cave.
caveModel.hasMany(murModel, { foreignKey: { allowNull: false } })
murModel.belongsTo(caveModel)

murModel.hasMany(emplacementModel, { foreignKey: { allowNull: false } })
emplacementModel.belongsTo(murModel)

emplacementModel.hasMany(pointModel, { foreignKey: { allowNull: false } })
pointModel.belongsTo(emplacementModel)

// Association cave utilisateur.
caveModel.belongsToMany(utilisateurModel, { through: 'CaveUtilisateur' })
utilisateurModel.belongsToMany(caveModel, { through: 'CaveUtilisateur' })


// Export models.
module.exports = {
    Sequelize: Sequelize,
    postgresClient: postgresClient,

    // Bouteille.
    bouteilleModel: bouteilleModel,
    appellationModel: appellationModel,
    domaineModel: domaineModel,
    millesimeModel: millesimeModel,
    nomBouteilleModel: nomBouteilleModel,
    tailleBouteilleModel: tailleBouteilleModel,
    typeVinModel: typeVinModel,

    // Cave.
    caveModel: caveModel,
    murModel: murModel,
    emplacementModel: emplacementModel,
    pointModel: pointModel,

    // Utilisateur
    utilisateurModel: utilisateurModel,
}
