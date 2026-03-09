const express = require('express')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const authRoutes = require('./routes/auth.routes')
const musicRoutes = require('./routes/music.routes')    

const app = express()

app.set('trust proxy', 1)

const corsOptions = {
	origin: true,
	credentials: true,
	methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
	allowedHeaders: ['Content-Type', 'Authorization']
}

app.use(cors(corsOptions))

app.use(express.json())
app.use(cookieParser())

app.use('/api/auth', authRoutes)

app.use('/api/music', musicRoutes)

module.exports = app