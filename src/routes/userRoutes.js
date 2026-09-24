import express from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';

import {
  registerUser,
  viewUser,
  updateUser,
  getCurrentUser,
} from '../controllers/userController.js';

const router = express.Router();

// Aqui eu digo que ao receber um post no endereço '/',
// que a função registerUser seja executada para tratar o que for "POSTado"
router.post('/', registerUser); // Isso vai gerar resultado lá no app.js
router.get('/me', authMiddleware, getCurrentUser);
router.get('/:id', authMiddleware, viewUser);
router.put('/:id', authMiddleware, updateUser);

export default router;
