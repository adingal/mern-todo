import 'dotenv/config'
import express from 'express'
import type { Request, Response, NextFunction } from 'express'
import cors from 'cors'
import morgan from 'morgan'
import mongoose from 'mongoose'
import cookieParser from 'cookie-parser'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'

import todoRoutes from './routes/todos.js'
import userRoutes from './routes/users.js'
import authRoutes from './routes/auth.js'

/**
 * Config
 */
const isProd = process.env.NODE_ENV === 'production'
const PORT = process.env.PORT || 5000

function getMongoUri(): string {
  if (process.env.NODE_ENV === 'development') {
    const local = process.env.DATABASE_LOCAL
    if (!local) throw new Error('DATABASE_LOCAL is not set.')
    return local
  }

  const { DATABASE, DATABASE_PASSWORD } = process.env
  if (!DATABASE) throw new Error('DATABASE is not set.')
  if (!DATABASE_PASSWORD) throw new Error('DATABASE_PASSWORD is not set.')
  return DATABASE.replace('<PASSWORD>', DATABASE_PASSWORD)
}

const MONGO_URI = getMongoUri()

if (isProd && !process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET is not set in production.')
}

/**
 * App
 */
const app = express()

// Render sits behind a proxy: needed for real client IPs and secure cookies
app.set('trust proxy', 1)

app.use(helmet())

if (isProd) {
  const clientUrl = process.env.CLIENT_URL
  if (!clientUrl) throw new Error('CLIENT_URL is not set in production.')

  app.use(cors({ origin: clientUrl, credentials: true }))
  app.use(morgan('combined'))
} else {
  app.use(cors({ origin: 'http://localhost:3000', credentials: true }))
  app.use(morgan('dev'))
}

app.use(express.json({ limit: '10kb' }))
app.use(cookieParser())

// Health check, before the limiters so it never gets blocked
app.get('/api/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'ok' })
})

// Global limiter
app.use('/api', rateLimit({ windowMs: 15 * 60 * 1000, limit: 300 }))

// Strict limiter for login and register
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  skipSuccessfulRequests: true,
  message: { status: 'fail', message: 'Too many attempts, try again later.' },
})

/**
 * Routes
 */
app.use('/api/todos', todoRoutes)
app.use('/api/users', userRoutes)
app.use('/api/auth/login', authLimiter)
app.use('/api/auth/register', authLimiter)
app.use('/api/auth', authRoutes)

// Unknown API routes, 404
app.use('/api', (req: Request, res: Response) => {
  res.status(404).json({
    status: 'fail',
    message: `Route ${req.method} ${req.originalUrl} not found.`,
  })
})

// Global error handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err)
  res.status(500).json({ status: 'error', message: 'Something went wrong.' })
})

/**
 * Start server
 */
async function start() {
  await mongoose.connect(MONGO_URI)
  console.log('Connected to MongoDB')

  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
  })
}

start().catch((err) => {
  console.error('Failed to start server:', err)
  process.exit(1)
})
