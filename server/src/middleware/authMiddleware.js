import jwt from 'jsonwebtoken'
import { findUserById, isMemoryMode, sanitizeUser } from '../data/devStore.js'
import User from '../models/User.js'
import { asyncHandler } from '../utils/asyncHandler.js'

export const protect = asyncHandler(async (req, _res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    const error = new Error('Not authorized, token missing')
    error.statusCode = 401
    throw error
  }

  const token = authHeader.split(' ')[1]
  const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev_kameez_wala_secret')
  const user = isMemoryMode()
    ? sanitizeUser(findUserById(decoded.userId)) || buildUserFromToken(decoded)
    : await User.findById(decoded.userId).select('-password')

  if (!user) {
    const error = new Error('User not found')
    error.statusCode = 401
    throw error
  }

  req.user = user
  next()
})

function buildUserFromToken(decoded) {
  if (!decoded?.userId || !decoded?.email || !decoded?.name || !decoded?.role) {
    return null
  }

  return {
    _id: decoded.userId,
    email: decoded.email,
    name: decoded.name,
    role: decoded.role,
  }
}

export const adminOnly = (req, _res, next) => {
  if (req.user?.role !== 'admin') {
    const error = new Error('Admin access only')
    error.statusCode = 403
    throw error
  }

  next()
}
