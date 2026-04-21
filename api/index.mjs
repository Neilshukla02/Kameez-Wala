import app from '../server/src/app.js'
import { connectDB } from '../server/src/config/db.js'

let databaseConnectionPromise

export default async function handler(req, res) {
  if (!databaseConnectionPromise) {
    databaseConnectionPromise = connectDB()
  }

  await databaseConnectionPromise
  return app(req, res)
}
