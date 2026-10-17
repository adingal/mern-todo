import type { Request, Response } from 'express'

export const getAllTodo = (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'success',
    message: 'Get all todo.',
  })
}

export const getTodo = (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'success',
    message: 'Get todo.',
  })
}

export const createTodo = (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'success',
    message: 'Create todo.',
  })
}

export const updateTodo = (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'success',
    message: 'Update todo.',
  })
}

export const deleteTodo = (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'success',
    message: 'Delete',
  })
}
