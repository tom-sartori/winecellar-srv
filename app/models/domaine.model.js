/**
 * Create table if not exists and set columns.
 * @param sequelize
 * @param Datatypes
 * @returns {*}
 */
module.exports = (sequelize, Datatypes) => {
    return sequelize.define("domaines", {
            name: {
                type: Datatypes.STRING,
                allowNull: false
            }
        },
        {
            timestamps: false
        }
    )
}
