import express from 'express'
import {
  getAllUser,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} from '../controllers/users.js'

const router = express.Router()

router.route('/').get(getAllUser).post(createUser)

router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser)

export default router
