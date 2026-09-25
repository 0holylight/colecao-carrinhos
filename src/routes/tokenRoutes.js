import express from 'express';
import { loginUser, logoutUser } from '../controllers/tokenController.js';
import { limiter } from '../middlewares/rateLimiter.js'

const router = express.Router();

router.post('/', limiter, loginUser);
router.delete('/', logoutUser);

export default router;
