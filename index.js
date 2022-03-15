const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = process.env.PORT || 3000

app.use(bodyParser.json())
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
)

app.get('/', (request, response) => {
    response.json({ info: 'Node.js, Express, and Postgres API' })
})


const { client } = require('./config')
client.connect(err => {
    if (err) {
        console.error('connection error', err.stack)
    } else {
        console.log('Connected to db')
    }
})


// 3
const db = require('./queries')
app.get('/appellation', db.getAppellation)



// A la fin
app.listen(port, () => {
    console.log(`App running on port ${port}. http://localhost:${port}`)
})

