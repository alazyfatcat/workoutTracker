// reference mongoose
const mongoose = require('mongoose')

// define project schema
var exercisesSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    dueDate: {
        type: Date
    },
    category: {
        type: String,
        required: true
    },
    length: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    }
})

// export the schema so it's public - visible to the controller
module.exports = mongoose.model('Exercise', exercisesSchema)
