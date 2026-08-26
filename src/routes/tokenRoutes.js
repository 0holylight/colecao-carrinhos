import express from 'express';
import { loginUser } from '../controllers/tokenController.js';
import { limiter } from '../middlewares/rateLimiter.js'

const router = express.Router();

router.post('/', limiter, loginUser);

export default router;
