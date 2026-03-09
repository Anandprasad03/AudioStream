const mongoose = require('mongoose')
require('dotenv').config()

const albumSchema = new mongoose.Schema({
    name: { type: String, required: true },
    musics: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Music' }],
    artist: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
})

module.exports = mongoose.model('Album', albumSchema)