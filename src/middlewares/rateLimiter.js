import { rateLimit } from "express-rate-limit";

export const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 20,
  message: {
    message:
      "Muitas requisições foram solicitadas por esse IP, tente novamente mais tarde.",
  },
});

export const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 5,
  message: {
    message: 
      "Muitas contas criadas a partir desse endereço. Tente novamente mais tarde."
  }
})