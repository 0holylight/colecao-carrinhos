import jwt from 'jsonwebtoken';

export async function authMiddleware(req, res, next) {
  const header = req.headers.authorization;
  if (!header) {
    return res.status(401).json({ message: 'Requisição sem token.' });
  }

  const parts = header.split(' '); // Cria um vetor de 2 elementos, [0] e [1]
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ message: 'Formato de token inválido.' });
  }

  const token = parts[1];

  try {
    const payloadDecoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = payloadDecoded.id;
    return next();
  } catch (e) {
    console.log(e);
    return res.status(401).json({ message: 'Token inválido ou expirado' });
  }
}
