import mongoose from 'mongoose'

export async function connectDB() {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is not set')
    }

    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    })
    console.log('MongoDB connected')
    process.env.USE_IN_MEMORY_DB = 'false'
    return true
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`)
    console.error(`Falling back to in-memory ${process.env.VERCEL ? 'deployment' : 'development'} data because MongoDB is unavailable.`)
    process.env.USE_IN_MEMORY_DB = 'true'
    return false
  }
}
