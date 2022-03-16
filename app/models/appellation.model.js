/**
 * Create table if not exists and set columns.
 */

const Datatype = require("sequelize");

module.exports = (sequelize) => {
    return sequelize.define("appellations", {
            name: {
                type: Datatype.STRING,
                allowNull: false
            }
        },
        {
            timestamps: false
            // updatedAt: 'newName'
            // defaultValue: 2
        }
    )
}
