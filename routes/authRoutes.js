import express from 'express'
import { authForm, changePassword, confirmEmail, forgotPassword, login, newPassword, postForgotPassword, register, registerForm } from '../controllers/authController.js'

const router = express.Router()

router.get('/login', authForm)
router.post('/login', login)

router.get('/register', registerForm)
router.post('/register', register)

router.get('/confirm/:token', confirmEmail)

router.get('/forgot-password', forgotPassword)
router.post('/forgot-password', postForgotPassword)

router.get('/change-password/:token',changePassword)
router.post('/change-password/:token', newPassword)

export default router