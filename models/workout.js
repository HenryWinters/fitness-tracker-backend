const mongoose = require('mongoose')

const workoutSchema = new mongoose.Schema({
    workoutTitle: String, 
    workoutNote: String, 
    workout: Array,
    likes: Array,
    comments: Array,    
    user: [
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