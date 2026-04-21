import jwt from 'jsonwebtoken'

export function generateToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET || 'dev_kameez_wala_secret', {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  })
}
