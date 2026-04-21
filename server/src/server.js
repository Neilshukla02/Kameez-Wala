import dotenv from 'dotenv'
import app from './app.js'
import { connectDB } from './config/db.js'

dotenv.config()

const port = process.env.PORT || 5000

const isDatabaseConnected = await connectDB()

app.listen(port, () => {
  console.log(`Server running on port ${port}${isDatabaseConnected ? '' : ' (memory mode)'}`)
})
