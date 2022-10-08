const logger = require('./logger')
const User = require('../models/user')
const jwt = require('jsonwebtoken')


const requestLogger = (request, response, next) => {
    logger.info('Method:', request.method)
    logger.info('Path:  ', request.path)
    logger.info('Body:  ', request.body)
    logger.info('---')
    next()
}

const tokenExtractor = (request, response, next) => {
    const authorization = request.get('authorization')
    
    if (authorization && authorization.toLowerCase().startsWith('bearer')) {
      request.token = authorization.substring(7)
    }

    next()
}

const userExtractor = async (request, response, next) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET)

  if (decodedToken.id) {
    request.user = await User.findById(decodedToken.id)
  }

  next()
}


const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }

const errorHandler = (error, request, response, next) => {
    if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    } else if (error.name === 'JsonWebTokenError') {
        return response.status(401).json({ error: 'invalid token' })
    }

    next(error)
}

module.exports = {
    requestLogger,
    tokenExtractor, 
    userExtractor,
    unknownEndpoint,
    errorHandler
}