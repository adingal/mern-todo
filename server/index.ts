import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import mongoose from 'mongoose'
import cookieParser from 'cookie-parser'

import todoRoutes from './routes/todos.js'
import userRoutes from './routes/users.js'
import authRoutes from './routes/auth.js'

/**
 * Server
 */
const DATABASE_LOCAL = process.env.DATABASE_LOCAL
const DATABASE = process.env.DATABASE
const PASSWORD = process.env.DATABASE_PASSWORD

function getMongoUri(): string {
  if (process.env.NODE_ENV === 'development') {
    if (!DATABASE_LOCAL)
      throw new Error('DATABASE_LOCAL is not set in config file.')
    return DATABASE_LOCAL
  }

  if (!DATABASE) throw new Error('DATABASE is not set in config file.')
  if (!PASSWORD) throw new Error('DATABASE_PASSWORD is not set in config file.')
  return DATABASE.replace('<PASSWORD>', PASSWORD)
}

const MONGO_URI = getMongoUri()

/**
 * App
 */
const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors({ origin: 'http://localhost:3000' }))
app.use(express.json())
app.use(morgan('dev'))
app.use(cookieParser())

/**
 * Routes
 */
app.use('/api/todos', todoRoutes)
app.use('/api/users', userRoutes)
app.use('/api/auth', authRoutes)

// Start the server only after the database connects
async function start() {
  if (!MONGO_URI) {
    throw new Error('MONGO_URI is not set, check your config file.')
  }

  await mongoose.connect(MONGO_URI)
  console.log('Connected to MongoDB')

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
  })
}

start().catch((err) => {
  console.error('Failed to start server:', err)
  process.exit(1)
})
