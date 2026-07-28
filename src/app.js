import express from 'express';
import cors from 'cors';

import userRoutes from './routes/userRoutes.js';
import tokenRoutes from './routes/tokenRoutes.js';

const app = express();

// MIDDLEWARES
app.use(express.json());
app.use(cors());

// ROUTES
app.use('/usuarios', userRoutes);
app.use('/tokens', tokenRoutes);

export default app;
