import { rateLimit } from 'express-rate-limit';

export const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 20,
  message: 'Muitas requisições foram solicitadas por esse IP, tente novamente mais tarde.',
})