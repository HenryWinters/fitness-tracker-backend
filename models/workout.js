const mongoose = require('mongoose')

const workoutSchema = new mongoose.Schema({
    workoutTitle: String, 
    workoutNote: String, 
    workout: Array,
    workoutTime: String,
    totalSets: Number, 
    totalReps: Number, 
    totalExercises: Number, 
    exerciseTitles: Array, 
    likeCount: Number,    
    user: [
        {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User'
        }
    ],
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User'
        }
    ]
})

workoutSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Workout', workoutSchema)