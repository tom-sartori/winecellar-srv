const models = include('models')
const CONSTANTS = include('config/constants')

for (let role of CONSTANTS.AUTHENTICATION.ROLES) {
    models.roleModel.create({ name: role })
}
