import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";

import userRoutes from "./routes/userRoutes.js";
import tokenRoutes from "./routes/tokenRoutes.js";
import carRoutes from "./routes/carRoutes.js";

import { errorHandler } from "./middlewares/errorHandler.js";

const app = express();

// MIDDLEWARES
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use(helmet());
app.use(cookieParser());
app.use("/uploads", express.static("uploads"));

// ROUTES
app.use("/usuarios", userRoutes);
app.use("/tokens", tokenRoutes);
app.use("/carros", carRoutes);

// ERROR-HANDLER
app.use(errorHandler);

export default app;
