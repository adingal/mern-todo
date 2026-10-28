import type { Request, Response } from 'express'
import mongoose from 'mongoose'
import Todo from '../models/todos.js'

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
}

export const createTodo = async (
  req: Request<object, unknown, CreateTodoBody>,
  res: Response,
): Promise<void> => {
  try {
    // Destructure only approved fields for security
    const { title, completed } = req.body

    // Check and validate required fields
    if (typeof title !== 'string' || title.trim() === '') {
      res.status(400).json({ status: 'fail', message: 'Title is required.' })
      return
    }

    // Create todo under the current user
    const todo = await Todo.create({ title, completed, user: req.user!._id })

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
    const updates: UpdateTodoBody = {}
    if (req.body.title !== undefined) {
      if (typeof req.body.title !== 'string' || req.body.title.trim() === '') {
        res
          .status(400)
          .json({ status: 'fail', message: 'Title cannot be blank.' })
        return
      }
      updates.title = req.body.title
    }
    if (req.body.completed !== undefined) updates.completed = req.body.completed

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
