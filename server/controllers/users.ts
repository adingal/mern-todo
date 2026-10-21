import type { Request, Response } from 'express'
import mongoose from 'mongoose'
import User from '../models/users.js'

export const getAllUser = async (
  _req: Request,
  res: Response,
): Promise<void> => {
  try {
    const users = await User.find()

    if (users.length === 0) {
      res.status(200).json({
        status: 'success',
        message: 'No users yet.',
        data: {
          users: [],
        },
      })
      return
    }

    res.status(200).json({
      status: 'success',
      results: users.length,
      data: {
        users,
      },
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Something went wrong.'
    res.status(500).json({ status: 'error', message })
  }
}

export const getUser = async (
  req: Request<{ id: string }>,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params

    if (!mongoose.isValidObjectId(id)) {
      res.status(400).json({ status: 'fail', message: 'Invalid id.' })
      return
    }

    const user = await User.findById(id)

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

interface CreateUserBody {
  name: string
  email: string
  password: string
}

export const createUser = async (
  req: Request<object, unknown, CreateUserBody>,
  res: Response,
): Promise<void> => {
  try {
    const { name, email, password } = req.body

    if (typeof name !== 'string' || name.trim() === '') {
      res.status(400).json({ status: 'fail', message: 'Name is required.' })
      return
    }

    if (typeof email !== 'string' || email.trim() === '') {
      res.status(400).json({ status: 'fail', message: 'Email is required.' })
      return
    }

    if (typeof password !== 'string') {
      res.status(400).json({ status: 'fail', message: 'Password is required.' })
      return
    }

    const user = await User.create({ name, email, password })

    res.status(200).json({
      status: 'success',
      data: { user },
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Something went wrong.'
    res.status(500).json({ status: 'error', message })
  }
}

interface UpdateUserBody {
  title?: string
  completed?: boolean
}

export const updateUser = async (
  req: Request<{ id: string }, unknown, UpdateUserBody>,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params

    if (!mongoose.isValidObjectId(id)) {
      res.status(400).json({ status: 'fail', message: 'Invalid id.' })
    }

    const users = await User.find()

    if (users.length === 0) {
      res.status(200).json({
        status: 'success',
        message: 'No users yet.',
        data: {
          users: [],
        },
      })
      return
    }

    res.status(200).json({
      status: 'success',
      results: users.length,
      data: {
        users,
      },
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Something went wrong.'
    res.status(500).json({ status: 'error', message })
  }
}

export const deleteUser = async (
  req: Request<{ id: string }>,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params

    if (!mongoose.isValidObjectId(id)) {
      res.status(400).json({ status: 'fail', message: 'Invalid id.' })
      return
    }

    const user = await User.findByIdAndDelete(id)

    if (!user) {
      res.status(404).json({ status: 'fail', message: 'User not found.' })
      return
    }

    res.status(204).end()
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Something went wrong.'
    res.status(500).json({ status: 'error', message })
  }
}
