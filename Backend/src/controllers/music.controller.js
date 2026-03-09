const musicModel = require('../models/music.model')
const jwt = require('jsonwebtoken')
const uploadFile = require('../services/storage.service')
require('dotenv').config()
const albumModel = require('../models/album.model')

function escapeRegex(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

async function createMusic(req, res) {

    const title = req.body.title
    const file = req.file

    if (!title || !file) {
        return res.status(400).json({ message: 'Title and music file are required' })
    }

    const result = await uploadFile(req.file.buffer)
    const music = await musicModel.create({
        uri: result.url,
        name: title,
        artist: req.user.id
    })
    res.status(201).json({ message: 'Music uploaded successfully', music })
}

async function createAlbum(req, res) {

    const { title, musics } = req.body

    if (!title || !Array.isArray(musics) || musics.length === 0) {
        return res.status(400).json({ message: 'Album title and song names are required' })
    }

    const normalizedNames = musics
        .map((name) => String(name).trim())
        .filter(Boolean)

    if (!normalizedNames.length) {
        return res.status(400).json({ message: 'At least one valid song name is required' })
    }

    const songs = await musicModel.find({
        artist: req.user.id,
        $or: normalizedNames.map((name) => ({
            name: { $regex: `^${escapeRegex(name)}$`, $options: 'i' }
        }))
    })

    const songsByName = new Map(
        songs.map((song) => [song.name.toLowerCase(), song])
    )

    const missing = normalizedNames.filter((name) => !songsByName.has(name.toLowerCase()))

    if (missing.length) {
        return res.status(400).json({
            message: `Songs not found in your uploads: ${missing.join(', ')}`
        })
    }

    const musicIds = normalizedNames.map((name) => songsByName.get(name.toLowerCase())._id)

    const album = await albumModel.create({
        name: title,
        musics: musicIds,
        artist: req.user.id
    })
    res.status(201).json({ message: 'Album created successfully', album })
}

async function getAllMusics(req,res){
    const musics = await musicModel
    .find()
    .populate("artist", "username email")
    .limit(10)

    res.status(200).json({
        message: "Musics fetched successfully",
        musics: musics
    })
}

async function getAllAlbums(req,res){
    const albums = await albumModel
    .find()
    .select("name artist musics")
    .populate("artist", "username email")
    .populate("musics")

    res.status(200).json({
        message: "Albums fetched successfully",
        albums: albums
    })
}

async function getAlbumById(req,res){
    const albumId = req.params.id
    const album = await albumModel.findById(albumId).populate("artist", "username email").populate("musics")
    res.status(200).json({
        message: "Album fetched successfully",
        album: album
    })
}

module.exports = { createMusic, createAlbum, getAllMusics, getAllAlbums, getAlbumById }