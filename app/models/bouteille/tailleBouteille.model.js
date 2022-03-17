/**
 * Create table if not exists and set columns.
 */

const Datatype = require("sequelize")

module.exports = (sequelize) => {
    return sequelize.define("tailleBouteille", {
            name: {
                type: Datatype.FLOAT,
                allowNull: false,
                validate: {
                    isFloat: true,
                    min: 0,
                    max: 50
                }
            }
        },
        {
            timestamps: false
        }
    )
}
