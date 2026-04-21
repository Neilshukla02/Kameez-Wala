import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import morgan from 'morgan'
import path from 'path'
import { fileURLToPath } from 'url'
import { seedProducts } from './data/seedProducts.js'
import { errorHandler, notFound } from './middleware/errorMiddleware.js'
import Product from './models/Product.js'
import authRoutes from './routes/authRoutes.js'
import cartRoutes from './routes/cartRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import productRoutes from './routes/productRoutes.js'

dotenv.config()

const app = express()
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const uploadsDirectory = path.resolve(__dirname, '../uploads')

const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5174',
].filter(Boolean)

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true)
        return
      }

      callback(new Error(`CORS blocked for origin: ${origin}`))
    },
    credentials: true,
  }),
)
app.use(express.json({ limit: '10mb' }))
app.use(morgan('dev'))
app.use('/uploads', express.static(uploadsDirectory))

app.get('/api/health', (_req, res) => {
  res.json({
    message: 'Kameez Wala API running',
    storage: process.env.USE_IN_MEMORY_DB === 'true' ? 'memory' : 'mongodb',
  })
})

app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/cart', cartRoutes)
app.use('/api/orders', orderRoutes)

app.post('/api/dev/seed', async (_req, res) => {
  if (process.env.USE_IN_MEMORY_DB === 'true') {
    res.json({ message: 'Seed not needed in memory mode' })
    return
  }

  const count = await Product.countDocuments()
  if (count === 0) {
    await Product.insertMany(seedProducts)
  }

  res.json({ message: 'Seed complete' })
})

app.use(notFound)
app.use(errorHandler)

export default app
