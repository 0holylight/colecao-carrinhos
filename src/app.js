import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";

import userRoutes from "./routes/userRoutes.js";
import tokenRoutes from "./routes/tokenRoutes.js";
import carRoutes from "./routes/carRoutes.js";

import { errorHandler } from "./middlewares/errorHandler.js";

const app = express();

// Em produção, o app fica atrás de intermediários (a Vercel e o Render)
app.set("trust proxy", 2);

// MIDDLEWARES
app.use(express.json());

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  }),
);

app.use(helmet());
app.use(cookieParser());

// ROUTES
app.use("/usuarios", userRoutes);
app.use("/tokens", tokenRoutes);
app.use("/carros", carRoutes);

// ERROR-HANDLER
app.use(errorHandler);

export default app;