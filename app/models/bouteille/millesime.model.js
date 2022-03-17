/**
 * Create table if not exists and set columns.
 */

const Datatype = require("sequelize")

module.exports = (sequelize) => {
    return sequelize.define("millesime", {
            name: {
                type: Datatype.INTEGER,
                allowNull: false,
                validate: {
                    isInt: true,
                    min: 1000,
                    max: 2100,
                    msg: 'Must be a int between 1000 and 2100. '
                }
            }
        },
        {
            timestamps: false
        }
    )
}
