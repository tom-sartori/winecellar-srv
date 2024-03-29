/**
 * Create table if not exists and set columns.
 */

const Datatype = require("sequelize")

module.exports = (sequelize) => {
    return sequelize.define("role", {
            name: {
                type: Datatype.STRING,
                allowNull: false,
                unique: true
            }
        },
        {
            timestamps: false
        }
    )
}
