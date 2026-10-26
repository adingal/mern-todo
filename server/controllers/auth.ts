import type { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import validator from 'validator'
import User from '../models/users.js'

// Sign token
const signToken = (id: string): string =>
  jwt.sign({ id }, process.env.JWT_SECRET as string, { expiresIn: '7d' })

// Cookie
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
}

/**
 * Login
 */
interface LoginBody {
  email?: unknown
  password?: unknown
}

export const login = async (
  req: Request<object, unknown, LoginBody>,
  res: Response,
): Promise<void> => {
  try {
    const { email, password } = req.body

    // Check email and password
    if (
      typeof email !== 'string' ||
      typeof password !== 'string' ||
      !email ||
      !password
    ) {
      res
        .status(400)
        .json({ status: 'fail', message: 'Email and password are required.' })
      return
    }

    // Find user with password selected
    const user = await User.findOne({
      email: email.trim().toLowerCase(),
    }).select('+password')

    // Check if there is a returned user
    if (!user || !(await user.comparePassword(password))) {
      res
        .status(401)
        .json({ status: 'fail', message: 'Incorrect email or password.' })
      return
    }

    // Sign token
    const token = signToken(user.id)

    // Set token on cookie for 7d
    res.cookie('jwt', token, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })

    // Build response by hand for security, exclude password
    res.status(200).json({
      status: 'success',
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          userType: user.userType,
        },
      },
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Something went wrong.'
    res.status(500).json({ status: 'error', message })
  }
}

/**
 * Logout
 */
export const logout = (_req: Request, res: Response): void => {
  res.clearCookie('jwt', cookieOptions)
  res.status(200).json({ status: 'success', message: 'Logged out.' })
}

/**
 * Register
 */
interface RegisterBody {
  name?: unknown
  email?: unknown
  password?: unknown
}

export const register = async (
  req: Request<object, unknown, RegisterBody>,
  res: Response,
): Promise<void> => {
  try {
    const { name, email, password } = req.body

    // Check name, email and password
    if (
      typeof name !== 'string' ||
      typeof email !== 'string' ||
      typeof password !== 'string' ||
      !name.trim() ||
      !email.trim() ||
      !password
    ) {
      res.status(400).json({
        status: 'fail',
        message: 'Name, email and password are required.',
      })
      return
    }

    // Validate email
    if (!validator.isEmail(email)) {
      res.status(400).json({ status: 'fail', message: 'Invalid email.' })
      return
    }

    // Create user
    const user = await User.create({ name, email, password })

    // Sign token
    const token = signToken(user.id)

    // Set token on cookie for 7d
    res.cookie('jwt', token, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })

    // Build response by hand for security, exclude password
    res.status(201).json({
      status: 'success',
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          userType: user.userType,
        },
      },
    })
  } catch (err) {
    // Check error code if duplicate email
    if (
      typeof err === 'object' &&
      err !== null &&
      'code' in err &&
      err.code === 11000
    ) {
      res.status(409).json({
        status: 'fail',
        message: 'Email is already registered.',
      })
      return
    }

    // Check error code if validation error
    if (err instanceof mongoose.Error.ValidationError) {
      res.status(400).json({ status: 'fail', message: err.message })
      return
    }

    const message = err instanceof Error ? err.message : 'Something went wrong.'
    res.status(500).json({ status: 'error', message })
  }
}

/**
 * Get current user
 */
export const getMe = (req: Request, res: Response): void => {
  // Check if req.user is mounted
  if (!req.user) {
    res.status(401).json({ status: 'fail', message: 'Not logged in.' })
    return
  }

  // Build response by hand for security, exclude password
  res.status(200).json({
    status: 'success',
    data: {
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        userType: req.user.userType,
      },
    },
  })
}
