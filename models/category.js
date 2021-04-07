// reference mongoose
const mongoose = require('mongoose')

// define project schema
var categorySchema = new mongoose.Schema({
    categoryCode: {
        type: String,
        required: true
    }
})

// export the schema so it's public - visible to the controller
module.exports = mongoose.model('Category', categorySchema)
