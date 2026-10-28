import type { Request, Response } from 'express'
import mongoose from 'mongoose'
import validator from 'validator'
import User, { USER_TYPES, type UserType } from '../models/users.js'

/**
 * Get all user
 */
export const getAllUser = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    // Set pagination
    const page = Math.max(1, Number(req.query.page) || 1)
    const limit = Math.min(100, Number(req.query.limit) || 20)
    const skip = (page - 1) * limit

    const [users, total] = await Promise.all([
      User.find().skip(skip).limit(limit),
      User.countDocuments(),
    ])

    // If no users yet
    if (users.length === 0) {
      res.status(200).json({
        status: 'success',
        message: 'No users yet.',
        data: { users: [] },
      })
      return
    }

    res.status(200).json({
      status: 'success',
      results: users.length,
      total,
      page,
      data: { users },
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Something went wrong.'
    res.status(500).json({ status: 'error', message })
  }
}

/**
 * Get user
 */
export const getUser = async (
  req: Request<{ id: string }>,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params

    // Check if id is valid
    if (!mongoose.isValidObjectId(id)) {
      res.status(400).json({ status: 'fail', message: 'Invalid id.' })
      return
    }

    // Get user and remove version key field
    const user = await User.findById(id).select('-__v')

    // If no user is found
    if (!user) {
      res.status(404).json({ status: 'fail', message: 'User not found.' })
      return
    }

    res.status(200).json({
      status: 'success',
      data: { user },
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Something went wrong.'
    res.status(500).json({ status: 'error', message })
  }
}

/**
 * Create user
 *
 * - admin only
 * - always prioritize /auth/register instead
 * - no cookie setting here
 */
interface CreateUserBody {
  name?: unknown
  email?: unknown
  password?: unknown
  userType?: unknown
}

// Type guard: checks the value at runtime and narrows it for TypeScript
const isUserType = (value: unknown): value is UserType =>
  typeof value === 'string' && (USER_TYPES as readonly string[]).includes(value)

export const createUser = async (
  req: Request<object, unknown, CreateUserBody>,
  res: Response,
): Promise<void> => {
  try {
    const { name, email, password, userType } = req.body

    // Check required fields
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

    // userType is optional. If it's sent, it must be one of the allowed values.
    if (userType !== undefined && !isUserType(userType)) {
      res.status(400).json({
        status: 'fail',
        message: `userType must be one of: ${USER_TYPES.join(', ')}.`,
      })
      return
    }

    // When userType is undefined, the schema default ('user') applies
    const user = await User.create({
      name,
      email,
      password,
      ...(userType !== undefined && { userType }), // Encountered an error on TS here, need to type check
    })

    // No cookie here, the admin stays logged in as themselves
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
    // Email duplicate check
    if (
      typeof err === 'object' &&
      err !== null &&
      'code' in err &&
      err.code === 11000
    ) {
      res
        .status(409)
        .json({ status: 'fail', message: 'Email is already registered.' })
      return
    }

    // Validation error check
    if (err instanceof mongoose.Error.ValidationError) {
      res.status(400).json({ status: 'fail', message: err.message })
      return
    }

    const message = err instanceof Error ? err.message : 'Something went wrong.'
    res.status(500).json({ status: 'error', message })
  }
}

/**
 * Delete user
 *
 * - admins only
 */
export const deleteUser = async (
  req: Request<{ id: string }>,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params

    // Check if id is valid
    if (!mongoose.isValidObjectId(id)) {
      res.status(400).json({ status: 'fail', message: 'Invalid id.' })
      return
    }

    const user = await User.findByIdAndDelete(id)

    // Check if there is a user
    if (!user) {
      res.status(404).json({ status: 'fail', message: 'User not found.' })
      return
    }

    // Return no content - standard
    res.status(204).end()
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Something went wrong.'
    res.status(500).json({ status: 'error', message })
  }
}
