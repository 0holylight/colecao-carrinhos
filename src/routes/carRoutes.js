import express from 'express';
import upload from '../config/uploads.js';

import {
  createCar,
  getCar,
  updateCar,
  deleteCar,
} from '../controllers/carController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', authMiddleware, upload.single('photo'), createCar);
router.get('/', authMiddleware, getCar);
router.put('/:id', authMiddleware, upload.single('photo'), updateCar);
router.delete('/:id', authMiddleware, deleteCar);

export default router;
