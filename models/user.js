const mongoose = require('mongoose')

const plm = require('passport-local-mongoose')

var userSchema = new mongoose.Schema({
    username: String,
    password: String,
    oauthId: String,
    oauthProvider: String,
    created: Date
})

userSchema.plugin(plm)

module.exports = mongoose.model('User', userSchema)