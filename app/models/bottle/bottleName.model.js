/**
 * Create table if not exists and set columns.
 */

const Datatype = require("sequelize")

module.exports = (sequelize) => {
    return sequelize.define("bottleName", {
            name: {
                type: Datatype.STRING,
                allowNull: false,
            },
            // validate: {
            //     is: /^([a-z]|\ |-|\.|,)*$"/i
            // }
        },
        {
            timestamps: false
        }
    )
}
