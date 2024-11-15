// src/routes/authRoutes.js
import { Router } from 'express';
import { register, login, logout, forgotPassword, changePassword } from '../controllers/authController.js';
import { registerValidator, loginValidator, forgotPasswordValidator, changePasswordValidator } from '../validations/auth.Validation.js';

const router = Router();

router.post('/register', registerValidator, register);
router.post('/login', loginValidator, login);
router.get('/logout', logout);
router.post('/forgot-password', forgotPasswordValidator, forgotPassword);
router.post('/change-password', changePasswordValidator, changePassword);


export default router;