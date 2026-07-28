/*
  Assinatura da função: (req, res, next) => {...} — os três parâmetros, mesmo que você só use dois deles diretamente por enquanto
  Pegar o cabeçalho: req.headers.authorization — mas lembra do formato: Bearer <token>, uma string só, com espaço no meio. 
  Você vai precisar separar a palavra Bearer do token de verdade — pensa em qual método de string faz isso (.split() é um bom candidato, dividindo pelo espaço)
  Se o header não existir (undefined, ninguém mandou Authorization): responde 401 direto, sem chamar next() — a requisição para ali
  Verificar o token: dentro de um try/catch, chama jwt.verify(token, process.env.JWT_SECRET). Isso devolve o payload decodificado ({ id: ..., iat: ..., exp: ... }) se tudo estiver certo 
— ou lança um erro se a assinatura não bater ou o token tiver expirado (é por isso que o try/catch é obrigatório aqui, diferente de simplesmente checar um if)
Anexar o id no req: algo tipo req.userId = payload.id; — pra ficar disponível pro controller que vem depois
Chamar next() — só depois de tudo validado, sem argumento nenhum, pra passar a bola pro controller de Car
No catch: 401, sem chamar next() — token inválido ou expirado nunca deveria deixar passar
*/
import jwt from 'jsonwebtoken';

export async function authMiddleware(req, res, next) {
  const header = req.headers.authorization;
  if (!header) {
    return res.status(401).json({ message: 'Requisição sem token.'})
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


/*
  const header = req.headers.authorization;
  if (!header) {
    return res.status(401).json({ message: 'Requisição sem token.' });
  }

  const parts = header.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ message: 'Formato de token inválido.' });
  }

  const token = parts[1];

  try {
    const payloadDecoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = payloadDecoded.id;
    return next();
  } catch (e) {
    console.error(e);
    return res.status(401).json({ message: 'Token inválido ou expirado.' });
  }
}
  */
