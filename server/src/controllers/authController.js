import bcrypt from 'bcryptjs'
import User from '../models/User.js'
import {
  createMemoryUser,
  findUserByEmail,
  findUserById,
  isMemoryMode,
  sanitizeUser,
} from '../data/devStore.js'
import { generateToken } from '../utils/generateToken.js'
import { asyncHandler } from '../utils/asyncHandler.js'

export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body

  if (!name || !email || !password) {
    const error = new Error('Please provide name, email, and password')
    error.statusCode = 400
    throw error
  }

  const existingUser = isMemoryMode() ? findUserByEmail(email) : await User.findOne({ email })
  if (existingUser) {
    const error = new Error('User already exists')
    error.statusCode = 400
    throw error
  }

  const user = isMemoryMode()
    ? createMemoryUser({ name, email, password })
    : await User.create({ name, email, password })

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken(user),
  })
})

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    const error = new Error('Please provide email and password')
    error.statusCode = 400
    throw error
  }

  const user = isMemoryMode() ? findUserByEmail(email) : await User.findOne({ email })

  const isMatch = user
    ? isMemoryMode()
      ? await bcrypt.compare(password, user.password)
      : await user.matchPassword(password)
    : false

  if (!user || !isMatch) {
    const error = new Error('Invalid email or password')
    error.statusCode = 401
    throw error
  }

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken(user),
  })
})

export const getCurrentUser = asyncHandler(async (req, res) => {
  res.json(isMemoryMode() ? sanitizeUser(findUserById(req.user._id)) : req.user)
})
