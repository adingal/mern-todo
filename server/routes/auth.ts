import express from 'express'
import { login, logout, register, getMe } from '../controllers/auth.js'
import { protect } from '../middlewares/auth.js'

const router = express.Router()

router.post('/login', login)
router.post('/logout', logout)
router.post('/register', register)
router.get('/me', protect, getMe)

export default router
