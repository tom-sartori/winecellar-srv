# winecellar-srv


Querry builder : sequelize : Equivalent to Java JOOQ

`npm init`
`npm install express pg`
`npm install cors dotenv`
`npm install -D nodemon`
`npm install sequelize`

`npm install cors jsonwebtoken bcryptjs`
`npm install --save multer` For images. 

`npm start`
`npm run start:dev`


```js
return appellationModel.findAll({
    attributes: ['id'],
    attributes: { exclude: ['id'] }
})
```


```js
get () {
    const val = this.getDataValue('lastName')
    return val ? val.toUpperCase() : null
}
```

```js
bouteilleModel.findAll({
    include: [
        {
            model: appellationModel,
            attributes: { include: [idAppellation] }, 
            where...
        },
        {
            model: appellationModel,
            attributes: { include: [idAppellation] }
        }
    ],
    attributes: { exclude: ['idBouteille'] }
})
```
