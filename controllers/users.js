const bcrypt = require('bcrypt')
const user = require('../models/user')
const usersRouter = require('express').Router()
const User = require('../models/user')
const middleware = require('../utils/middleware')

usersRouter.post('/', async (request, response) => {
    const { username, name, password, city, bio, color, registerDate } = request.body

    const existingUser = await User.findOne({ username })
    if (existingUser) {
        return response.status(400).json({
            error: 'username already taken'
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

usersRouter.get('/:username', async (request, response) => {
    const user = await User.find({ username: request.params.username })
    response.json(user)
})

usersRouter.get('/:username/following', async (request, response) => {
    const user = await User.find({ username: request.params.username }).select({ following: 1 })
    const userFollowing = user[0].following
    response.json(userFollowing)
})

usersRouter.get('/:username/followers', async (request, response) => {
    const user = await User.find({ username: request.params.username }).select({ followers: 1, likes: 1 })
    const usersFollowers = user[0].followers
    const usersLikes = user[0].likes
    response.json({ followers: usersFollowers, likes: usersLikes })
})

usersRouter.get('/:username/following/info', async (request, response) => {
    const user = await User.find({ username: request.params.username })
        .populate('following')
    const userFollowing = user[0].following
    const userFollowingNamesAndUsernames = userFollowing.map(user => { 
        return { 
            id: user['id'],
            name: user['name'], 
            username: user['username'],
            city: user['city']
        }
    })
    response.json(userFollowingNamesAndUsernames)
})

usersRouter.get('/:username/followers/info', async (request, response) => {
    const user = await User.find({ username: request.params.username })
        .populate('followers')
    const userFollowers = user[0].followers
    const userFollowersNamesAndUsernames = userFollowers.map(user => { 
        return { 
            id: user['id'],
            name: user['name'], 
            username: user['username'],
            city: user['city']
        }
    })
    response.json(userFollowersNamesAndUsernames)
})

usersRouter.get('/')

usersRouter.patch('/follow/:id', middleware.userExtractor, async (request, response) => {
    const body = request.body 
    const user = request.user

    const userToFollow = await User.findById(body.id)
    userToFollow.followers = userToFollow.followers.concat(user.id)
    await userToFollow.save()
    
    user.following = user.following.concat(request.params.id)
    const updatedUser = await user.save()

    response.status(200).json(updatedUser)
})

usersRouter.patch('/unfollow/:id', middleware.userExtractor, async (request, response) => {
    const body = request.body 
    const user = request.user

    const updatedUnfollowedUser = await User.findByIdAndUpdate(body.id, { $pull: { followers: user.id }})
    
    const updatedUser = await User.findByIdAndUpdate(user.id, { $pull: { following: body.id }})

    response.status(200).json(updatedUser)
})

usersRouter.patch('/edit/:id', middleware.userExtractor, async (request, response) => {
    const body = request.body 
    const user = request.user 

    const updatedUser = await User.findByIdAndUpdate(user.id, body)

    response.status(200).json(updatedUser)
})



module.exports = usersRouter

