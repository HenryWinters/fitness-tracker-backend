const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.post('/', async (request, response) => {
    const { username, name, password, city, bio, color, registerDate } = request.body

    const existingUser = await User.findOne({ username })
    if (existingUser) {
        return response.status(400).json({
            error: 'username must be unique'
        })
    }
    if (!username || !password || !name ) {
        return response.status(400).json({
            error: 'username, password, and name are required'
        })
    }

    if (username.length < 3) {
        return response.status(400).json({
            error: 'username must be at least 3 characters long'
        })
    }

    const passwordRegex = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
    if (!passwordRegex.test(password)) {
        return response.status(400).json({
            error: 'Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character (@, $, !, %, *, ?, &)'
        })
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = new User ({
        username, 
        name, 
        passwordHash, 
        city, 
        bio, 
        color, 
        registerDate, 
        workoutCount: 0,
        exerciseCount: 0,
        setCount: 0, 
        repCount: 0,
    })

    const savedUser = await user.save() 

    response.status(201).json(savedUser)
})

usersRouter.get('/', async (request, reponse) => {
    const users = await User.find({})
    reponse.json(users)
})

module.exports = usersRouter

