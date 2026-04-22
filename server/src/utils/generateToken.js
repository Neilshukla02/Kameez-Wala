import jwt from 'jsonwebtoken'

export function generateToken(userOrId) {
  const payload =
    typeof userOrId === 'object' && userOrId !== null
      ? {
          userId: userOrId._id,
          email: userOrId.email,
          name: userOrId.name,
          role: userOrId.role,
        }
      : { userId: userOrId }

  return jwt.sign(payload, process.env.JWT_SECRET || 'dev_kameez_wala_secret', {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  })
}
