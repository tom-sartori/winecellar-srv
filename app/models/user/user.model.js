/**
 * Create table if not exists and set columns.
 */

const Datatype = require("sequelize")

module.exports = (sequelize) => {
    return sequelize.define("user", {
            id: {
                type: Datatype.UUID,
                primaryKey: true,
                defaultValue: Datatype.UUIDV4
            },
            username: {
                type: Datatype.STRING,
                allowNull: false,
                unique: true
            },
            email: {
                type: Datatype.STRING,
                allowNull: false,
                unique: true,
                validate: {
                    isEmail: true
                }
            },
            lastName: {
                type: Datatype.STRING,
            },
            firstName: {
                type: Datatype.STRING,
            },
            password: {
                type: Datatype.STRING,
                allowNull: false,
                validate: {
                    len: [8, 100]
                },
            }
        }
    )
}
