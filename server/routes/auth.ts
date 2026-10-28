import express from 'express'
import {
  login,
  logout,
  register,
  getMe,
  updateMe,
  deleteMe,
} from '../controllers/auth.js'
import { protect } from '../middlewares/auth.js'

const router = express.Router()

router.post('/login', login)
router.post('/logout', logout)
router.post('/register', register)

// Logged in user
router.use(protect)
router.route('/me').get(getMe).patch(updateMe).delete(deleteMe)

export default router
