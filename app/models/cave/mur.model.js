/**
 * Create table if not exists and set columns.
 */

const Datatype = require("sequelize")

module.exports = (sequelize) => {
    return sequelize.define("mur", {
            image: {
                type: Datatype.STRING,
                allowNull: false
            }
        },
        {
            timestamps: false
        }
    )
}
