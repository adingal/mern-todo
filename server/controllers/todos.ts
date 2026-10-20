import type { Request, Response } from 'express'
import mongoose from 'mongoose'
import Todo from '../models/todos.js'

export const getAllTodo = async (
  _req: Request,
  res: Response,
): Promise<void> => {
  try {
    const todos = await Todo.find()

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

export const getTodo = async (
  req: Request<{ id: string }>,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params

    if (!mongoose.isValidObjectId(id)) {
      res.status(400).json({ status: 'fail', message: 'Invalid id.' })
      return
    }

    const todo = await Todo.findById(id)

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

interface CreateTodoBody {
  title: string
  completed: boolean
}

export const createTodo = async (
  req: Request<object, unknown, CreateTodoBody>,
  res: Response,
): Promise<void> => {
  try {
    const { title, completed } = req.body

    if (typeof title !== 'string' || title.trim() === '') {
      res.status(400).json({ status: 'fail', message: 'Title is required.' })
      return
    }

    const todo = await Todo.create({ title, completed })

    res.status(201).json({
      status: 'success',
      data: { todo },
    })
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      res.status(400).json({ status: 'fail', message: err.message })
      return
    }

    const message = err instanceof Error ? err.message : 'Something went wrong.'
    res.status(500).json({ status: 'error', message })
  }
}

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

    if (!mongoose.isValidObjectId(id)) {
      res.status(400).json({ status: 'fail', message: 'Invalid id.' })
      return
    }

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

    if (Object.keys(updates).length === 0) {
      res
        .status(400)
        .json({ status: 'fail', message: 'No valid fields to update.' })
      return
    }

    const todo = await Todo.findByIdAndUpdate(id, updates, {
      returnDocument: 'after',
      runValidators: true,
    })

    if (!todo) {
      res.status(404).json({ status: 'fail', message: 'Todo not found.' })
      return
    }

    res.status(200).json({
      status: 'success',
      data: { todo },
    })
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      res.status(400).json({ status: 'fail', message: err.message })
      return
    }

    const message = err instanceof Error ? err.message : 'Something went wrong.'
    res.status(500).json({ status: 'error', message })
  }
}

export const deleteTodo = async (
  req: Request<{ id: string }>,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params

    if (!mongoose.isValidObjectId(id)) {
      res.status(400).json({ status: 'fail', message: 'Invalid id.' })
      return
    }

    const todo = await Todo.findByIdAndDelete(id)

    if (!todo) {
      res.status(404).json({ status: 'fail', message: 'Todo not found.' })
      return
    }

    res.status(204).end()
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Something went wrong.'
    res.status(500).json({ status: 'error', message })
  }
}
