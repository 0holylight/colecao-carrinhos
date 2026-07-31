import express from 'express';
import cors from 'cors';

import userRoutes from './routes/userRoutes.js';
import tokenRoutes from './routes/tokenRoutes.js';
import carRoutes from './routes/carRoutes.js';

const app = express();

// MIDDLEWARES
app.use(express.json());
app.use(cors());

// ROUTES
app.use('/usuarios', userRoutes);
app.use('/tokens', tokenRoutes);
app.use('/carros', carRoutes);

export default app;
