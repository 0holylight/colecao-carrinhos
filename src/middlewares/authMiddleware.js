import jwt from 'jsonwebtoken';

export async function authMiddleware(req, res, next) {
  const cookie = req.cookies.token;
  if (!cookie) {
    return res.status(401).json({ message: 'Requisição sem token.' });
  } else {
    try {
      const payloadDecoded = jwt.verify(cookie, process.env.JWT_SECRET);
      req.userId = payloadDecoded.id;
      return next();
    } catch (e) {
      console.log(e);
      return res.status(401).json({ message: 'Token inválido ou expirado' });
    }
  }
}
