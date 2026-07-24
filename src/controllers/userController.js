/*
Função async (req, res) => {...}
Destruturar name, username, password de req.body
Gerar hash da senha com bcrypt (método assíncrono, precisa de await) — você lembra o nome dele, ou quer que eu confirme?
db.User.create({...}) — passando o hash, nunca a senha original
res.status(...).json(...) — decide o status certo pra "criado com sucesso", e se vai devolver a senha (mesmo em hash) na resposta ou não
Tudo dentro de try/catch, pensando no caso de username duplicado

Pelo que eu entendi, aqui eu vou capturar o registro do usuario,
então eu preciso pegar um post.
*/

import db from '../models/index.js';
import bcrypt from 'bcrypt';

export async function registerUser(req, res) {
  const { name, username, password } = req.body;

  try {
    if (!name) return res.status(400).json({ message: 'Você precisa inserir o seu nome.' });
    if (!username) return res.status(400).json({ message: 'Username não preenchido.' });
    if (!password) return res.status(400).json({ message: 'Senha não foi enviada.' });

    const match = await db.User.findOne({ where: { username: username } });
    if (match === null) {
      const hashPassword = await bcrypt.hash(password, 10);
      await db.User.create({
        name,
        username,
        password: hashPassword,
      });
      console.log(`Usuário: ${username} criado com sucesso!`);
      res.status(201).json({ message: 'Usuário criado com sucesso' }); // *
    } else {
      console.log('O usuário já foi tomado.');
      res.status(409).json({ message: 'Esse username já está em uso' }); // *
    }
  } catch (e) {
    console.log(e);
    res
      .status(500)
      .json({ message: 'Um erro interno ocorreu, tente novamente.' });
  }
}
