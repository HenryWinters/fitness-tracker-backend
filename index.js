const express = require('express')
const app = express()
const cors = require('cors')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const workoutsRouter = require('./controllers/workouts')
const mongoose = require('mongoose')
const config = require('./utils/config')
const middleware = require('./utils/middleware')

const mongoUrl = config.MONGODB_URI
mongoose.connect(mongoUrl)

app.use(cors())
app.use(express.json())
app.use(middleware.requestLogger)
app.use(middleware.tokenExtractor)

app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.use('/api/workouts', workoutsRouter)

app.listen(config.PORT, () => {
    console.log(`Server running on port ${config.PORT}`)
})

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app 