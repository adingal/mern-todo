import express from 'express'
import {
  getAllUser,
  getUser,
  createUser,
  deleteUser,
} from '../controllers/users.js'

import { protect, isAdmin } from '../middlewares/auth.js'

const router = express.Router()

// Protect user routes - admin only
router.use(protect, isAdmin)
router.route('/').get(getAllUser).post(createUser)
router.route('/:id').get(getUser).delete(deleteUser)

export default router
