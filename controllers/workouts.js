const workoutsRouter = require('express').Router()
const Workout = require('../models/workout')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const middleware = require('../utils/middleware')

workoutsRouter.post('/', middleware.userExtractor, async (request, response) => {
    const body = request.body
    const user = request.user

    const workout = new Workout({
        workoutTitle: body.workoutTitle, 
        workoutNote: body.workoutNote,
        workoutTime: body.workoutTime,
        workout: body.workout,
        likeCount: 0, 
        user: user._id
    })

    const savedWorkout = await workout.save()
    user.workouts = user.workouts.concat(savedWorkout._id)
    await user.save()
    response.status(201).json(savedWorkout)
})

workoutsRouter.get('/:id', async (request, response) => {
    const workouts = await Workout.find({ user: request.params.id })
        .sort({ workoutTime: -1 })
        .limit(10)
    response.json(workouts)
})


module.exports = workoutsRouter