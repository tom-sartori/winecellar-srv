/**
 * Create table if not exists and set columns.
 */

const Datatype = require("sequelize")

module.exports = (sequelize) => {
    return sequelize.define("point", {
            x: {
                type: Datatype.REAL,
                allowNull: false,
            },
            y: {
                type: Datatype.REAL,
                allowNull: false,
            }
        },
        {
            timestamps: false
        }
    )
}
