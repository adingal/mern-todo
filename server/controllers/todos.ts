import type { Request, Response } from 'express'
import mongoose from 'mongoose'
import Todo, { TODO_TYPES, type TodoType } from '../models/todos.js'

// Check todo type
const isTodoType = (value: unknown): value is TodoType =>
  typeof value === 'string' && (TODO_TYPES as readonly string[]).includes(value)

// Returns a Date, or null if the value isn't a valid date string
const parseDate = (value: unknown): Date | null => {
  if (typeof value !== 'string') return null
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

/**
 * Get all todo
 */
export const getAllTodo = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    // Get all todo under the current user
    const todos = await Todo.find({ user: req.user!._id })

    // Check if there is todos
    if (todos.length === 0) {
      res.status(200).json({
        status: 'success',
        message: 'No todos yet.',
        data: {
          todos: [],
        },
      })
      return
    }

    res.status(200).json({
      status: 'success',
      results: todos.length,
      data: {
        todos,
      },
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Something went wrong.'
    res.status(500).json({ status: 'error', message })
  }
}

/**
 * Get todo
 */
export const getTodo = async (
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

    // Get todo under the current user
    const todo = await Todo.findOne({ _id: id, user: req.user!._id })

    // Check if there is todo
    if (!todo) {
      res.status(404).json({ status: 'fail', message: 'Todo not found.' })
      return
    }

    res.status(200).json({
      status: 'success',
      data: { todo },
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Something went wrong.'
    res.status(500).json({ status: 'error', message })
  }
}

/**
 * Create todo
 */
interface CreateTodoBody {
  title: string
  completed: boolean
  type?: TodoType
  dueDate?: Date
}

export const createTodo = async (
  req: Request<object, unknown, CreateTodoBody>,
  res: Response,
): Promise<void> => {
  try {
    // Destructure only approved fields for security
    const { title, completed, type, dueDate } = req.body

    // Check and validate required fields
    if (typeof title !== 'string' || title.trim() === '') {
      res.status(400).json({ status: 'fail', message: 'Title is required.' })
      return
    }

    // Check and validate type
    if (type !== undefined && !isTodoType(type)) {
      res.status(400).json({
        status: 'fail',
        message: `Type must be one of: ${TODO_TYPES.join(', ')}.`,
      })
      return
    }

    // Check and validate due date
    const parsedDue = dueDate !== undefined ? parseDate(dueDate) : undefined
    if (dueDate !== undefined && !parsedDue) {
      res
        .status(400)
        .json({ status: 'fail', message: 'dueDate must be a valid date.' })
      return
    }

    // Create todo under the current user
    const todo = await Todo.create({
      title,
      user: req.user!._id,
      ...(completed !== undefined && { completed }),
      ...(type !== undefined && { type }),
      ...(parsedDue && { dueDate: parsedDue }),
    })

    res.status(201).json({
      status: 'success',
      data: { todo },
    })
  } catch (err) {
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
 * Update todo
 */
interface UpdateTodoBody {
  title?: string
  completed?: boolean
  type?: TodoType
  dueDate?: Date
}

export const updateTodo = async (
  req: Request<{ id: string }, unknown, UpdateTodoBody>,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params

    // Check if id is valid
    if (!mongoose.isValidObjectId(id)) {
      res.status(400).json({ status: 'fail', message: 'Invalid id.' })
      return
    }

    // Check and validate fields
    const { title, type, completed, dueDate } = req.body
    const updates: UpdateTodoBody = {}
    if (title !== undefined) {
      if (typeof title !== 'string' || title.trim() === '') {
        res
          .status(400)
          .json({ status: 'fail', message: 'Title cannot be blank.' })
        return
      }
      updates.title = title
    }
    if (completed !== undefined) updates.completed = completed

    // Check and validate type
    if (type !== undefined) {
      if (!isTodoType(type)) {
        res.status(400).json({
          status: 'fail',
          message: `type must be one of: ${TODO_TYPES.join(', ')}.`,
        })
        return
      }
      updates.type = type
    }

    // Check and validate due date
    if (dueDate !== undefined) {
      const parsed = parseDate(dueDate)
      if (!parsed) {
        res
          .status(400)
          .json({ status: 'fail', message: 'dueDate must be a valid date.' })
        return
      }
      updates.dueDate = parsed
    }

    // Check if there are updates
    if (Object.keys(updates).length === 0) {
      res
        .status(400)
        .json({ status: 'fail', message: 'No valid fields to update.' })
      return
    }

    // Update todo under current user
    const todo = await Todo.findOneAndUpdate(
      { _id: id, user: req.user!._id },
      updates,
      {
        returnDocument: 'after',
        runValidators: true,
      },
    )

    // Check if there is todo
    if (!todo) {
      res.status(404).json({ status: 'fail', message: 'Todo not found.' })
      return
    }

    res.status(200).json({
      status: 'success',
      data: { todo },
    })
  } catch (err) {
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
 * Delete todo
 */
export const deleteTodo = async (
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

    // Delete todo under the current user
    const todo = await Todo.findOneAndDelete({ _id: id, user: req.user!._id })

    // Check if there is todo
    if (!todo) {
      res.status(404).json({ status: 'fail', message: 'Todo not found.' })
      return
    }

    // No content
    res.status(204).end()
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Something went wrong.'
    res.status(500).json({ status: 'error', message })
  }
}
