/**
 * Create table if not exists and set columns.
 */

const Datatype = require("sequelize")

module.exports = (sequelize) => {
    return sequelize.define("vintage", {
            name: {
                type: Datatype.INTEGER,
                allowNull: false,
                validate: {
                    isInt: true,
                    min: 1000,
                    max: 2100
                }
            }
        },
        {
            timestamps: false
        }
    )
}
