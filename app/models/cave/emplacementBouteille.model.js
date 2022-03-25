/**
 * Create table if not exists and set columns.
 */

const Datatype = require("sequelize")

module.exports = (sequelize) => {
    return sequelize.define("emplacementBouteille", {
        quantity: {
            type: Datatype.INTEGER,
            allowNul: false,
            validate: {
                isInt: true,
                min: 0,
            }
        }
        }, { timestamps: false }
    )
}
