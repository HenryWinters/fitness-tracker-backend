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
        totalSets: body.totalSets, 
        totalReps: body.totalReps, 
        totalExercises: body.totalExercises,
        exerciseTitles: body.exerciseTitles, 
        likeCount: 0, 
        user: user._id
    })

    const savedWorkout = await workout.save()
    user.workouts = user.workouts.concat(savedWorkout._id)
    user.workoutCount = user.workoutCount + 1
    user.exerciseCount = user.exerciseCount + workout.totalExercises
    user.setCount = user.setCount + workout.totalSets
    user.repCount = user.repCount + workout.totalReps 
    await user.save()
    response.status(201).json(savedWorkout)
})

workoutsRouter.get('/:id', async (request, response) => {
    const workouts = await Workout.find({ user: request.params.id })
        .sort({ workoutTime: -1 })
        .limit(10)
        .populate('user')
    response.json(workouts)
})

workoutsRouter.delete('/:id', middleware.userExtractor, async (request, response) => {
    const user = request.user

    const workoutToDelete = await Workout.findById(request.params.id)

    if (user.id === workoutToDelete.user.toString()) {
        await Workout.findByIdAndRemove(request.params.id)

        const indexOfWorkout = user.workouts.indexOf(request.params.id)
        if (indexOfWorkout > -1) {
            user.workouts.splice(indexOfWorkout, 1)
        }
        user.workoutCount = user.workoutCount - 1
        user.exerciseCount = user.exerciseCount - workoutToDelete.totalExercises
        user.setCount = user.setCount - workoutToDelete.totalSets
        user.repCount = user.repCount - workoutToDelete.totalReps

        await user.save()

        response.status(204).end()
    }
})


module.exports = workoutsRouter