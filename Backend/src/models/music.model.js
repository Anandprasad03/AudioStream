const mongoose = require('mongoose')

const musicSchema = new mongoose.Schema({
    uri: { type: String, required: true },
    name: { type: String, required: true },
    artist: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
})

module.exports = mongoose.model('Music', musicSchema)