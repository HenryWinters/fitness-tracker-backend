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

workoutsRouter.get('/:username', async (request, response) => {
    const userWithUsername = await User.find({ username: request.params.username })
    const id = userWithUsername[0]._id
    const workouts = await Workout.find({ user: id })
        .sort({ workoutTime: -1 })
        .populate('user')
    response.json(workouts)
})

workoutsRouter.get('/:id/likes', async (request, response) => {
    const workoutLikes = await Workout.findById(request.params.id)
        .select({ likes: 1 })
        .populate('likes')
    response.json(workoutLikes)
})

workoutsRouter.get('/:username/feed', async (request, response) => {
    const userWithUsername = await User.find({ username: request.params.username })
    const followingIdArr = userWithUsername[0].following
    const followingAndUserIdArr = followingIdArr.concat(userWithUsername[0].id)
    const workouts = await Workout.find({user: {$in: followingAndUserIdArr }})
        .sort({ workoutTime: -1 })
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

workoutsRouter.patch('/like/:id', middleware.userExtractor, async (request, response) => {
    const idToLike = request.body.id
    const user = request.user

    const workoutToUpdate = await Workout.findById(idToLike) 

    if (workoutToUpdate.likes.includes(user.id)) {
        return response.status(409).json({
            error: 'User has already liked post'
        })
    } 
    
    workoutToUpdate.likes = workoutToUpdate.likes.concat(user.id)
    workoutToUpdate.likeCount = workoutToUpdate.likeCount + 1
    await workoutToUpdate.save() 
    const updatedUser = await User.findByIdAndUpdate(user.id, { $push: { likes: idToLike }})

    response.status(200).json(workoutToUpdate)
})

workoutsRouter.patch('/unlike/:id', middleware.userExtractor, async (request, response) => {
    const idToUnlike = request.body.id
    const user = request.user
    
    const updatedLikes = await Workout.findByIdAndUpdate(idToUnlike, { $pull: { likes: user.id }})
    const updatedLikeCount = await Workout.findByIdAndUpdate(idToUnlike, { $inc: { likeCount: -1 }})

    const updatedUser = await User.findByIdAndUpdate(user.id, { $pull: { likes: idToUnlike }})

    response.status(200).json(updatedLikeCount)
})


module.exports = workoutsRouter