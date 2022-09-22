const express = require('express')
const app = express()
const cors = require('cors')
const usersRouter = require('./controllers/users')
const mongoose = require('mongoose')
const config = require('./utils/config')

const mongoUrl = config.MONGODB_URI
mongoose.connect(mongoUrl)

app.use(cors())
app.use(express.json())

app.use('/api/users', usersRouter)

app.get('/', (request, response) => {
    response.send('<h1>Hello World</>')
})

app.listen(config.PORT, () => {
    console.log(`Server running on port ${config.PORT}`)
})

module.exports = app 