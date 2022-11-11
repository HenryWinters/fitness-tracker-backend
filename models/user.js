const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: String, 
    name: String, 
    city: String, 
    bio: String, 
    color: String, 
    registerDate: String, 
    passwordHash: String,
    followers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    following: [
        {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User'
        }
    ],  
    workouts: [
        {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Workout'
        }
    ], 
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Workout'
        }
    ],
    workoutCount: Number, 
    exerciseCount: Number,
    setCount: Number, 
    repCount: Number
})

userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
        delete returnedObject.passwordHash
    }
})

module.exports = mongoose.model('User', userSchema)