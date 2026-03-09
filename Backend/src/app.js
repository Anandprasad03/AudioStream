const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const authRoutes = require('./routes/auth.routes')
const musicRoutes = require('./routes/music.routes')
require('dotenv').config()    

const app = express()

app.use(cors({
  origin: 'https://audio-stream-nine.vercel.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json())
app.use(cookieParser())

app.use('/api/auth', authRoutes)

app.use('/api/music', musicRoutes)

module.exports = app