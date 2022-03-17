/**
 * Create table if not exists and set columns.
 */

const Datatype = require("sequelize")

module.exports = (sequelize) => {
    return sequelize.define("typeVin", {
            name: {
                type: Datatype.STRING,
                allowNull: false,
                validate: {
                    isAlpha: true
                }
            }
        },
        {
            timestamps: false
        }
    )
}
