// src/routes/testRoutes.js
import { Router } from 'express';
import { allAccess, userBoard, guestBoard, adminBoard } from '../controllers/testController.js';
import { authenticateToken } from '../middlewares/authenticateToken.js';

const router = Router();

// Rutas para probar acceso según roles
router.get('/all', allAccess); // Acceso público, sin necesidad de autenticación
router.get('/user', authenticateToken(['registered', 'admin']), userBoard); // Acceso para usuarios registrados y administradores
router.get('/guest', authenticateToken(['guest', 'registered', 'admin']), guestBoard); // Acceso para todos: invitados, registrados y administradores
router.get('/admin', authenticateToken(['admin']), adminBoard); // Solo acceso para administradores

export default router;

