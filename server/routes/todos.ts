import express from 'express'
import {
  getAllTodo,
  getTodo,
  createTodo,
  updateTodo,
  deleteTodo,
} from '../controllers/todos.js'
import { protect } from '../middlewares/auth.js'

const router = express.Router()

router.use(protect)

router.route('/').get(getAllTodo).post(createTodo)
router.route('/:id').get(getTodo).patch(updateTodo).delete(deleteTodo)

export default router
