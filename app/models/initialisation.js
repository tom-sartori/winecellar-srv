const models = include('models')
const CONSTANTS = include('config/constants')

for (let i = 0; i < CONSTANTS.AUTHENTICATION.ROLES.length; i++) {
    models.roleModel.create({ name: CONSTANTS.AUTHENTICATION.ROLES[i] })
}
