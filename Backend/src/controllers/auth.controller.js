const userModel = require('../models/user.model')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

function getCookieOptions(req) {
    const isSecure = req.secure || req.headers['x-forwarded-proto'] === 'https'

    return {
        httpOnly: true,
        secure: isSecure,
        sameSite: isSecure ? 'none' : 'lax',
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

async function register(req, res) {
    try {
        const { username, email, password, role = "user" } = req.body

        const existingUser = await userModel.findOne({
            $or: [
                { email },
                { username }
            ]
        })
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' })
        }

        const hash = await bcrypt.hash(password, 10)

        const user = await userModel.create({
            username,
            email,
            password: hash,
            role
        })

        const token = jwt.sign({
            id: user._id,
            role: user.role
        }, process.env.JWT_SECRET)

        res.cookie('token', token, getCookieOptions(req))

        await user.save()

        res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

async function login(req, res) {
    try {
        const { username, email, password } = req.body

        const user = await userModel.findOne({
            $or: [
                { email },
                { username }
            ]
        })

        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' })
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' })
        }

        const token = jwt.sign({
            id: user._id,
            role: user.role
        }, process.env.JWT_SECRET)

        res.cookie('token', token, getCookieOptions(req))

        res.json({
            message: 'Login successful',
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

async function logout(req, res) {
    res.clearCookie('token', getCookieOptions(req))
    res.json({ message: 'Logout successful' })
}

module.exports = { register, login, logout }