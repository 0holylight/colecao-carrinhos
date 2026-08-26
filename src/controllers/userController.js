import db from '../models/index.js';
import bcrypt from 'bcrypt';

export async function registerUser(req, res) {
  const { name, username, password } = req.body;

  try {
    // Validação de NULL
    if (!name)
      return res
        .status(400)
        .json({ message: 'Você precisa inserir o seu nome.' });
    if (!username)
      return res.status(400).json({ message: 'Username não preenchido.' });
    if (!password)
      return res.status(400).json({ message: 'Senha não foi enviada.' });

    // Validação de limites
    if (name.length < 4 || name.length > 100)
      return res
        .status(400)
        .json({ message: 'Nome precisa conter de 4 a 100 caracteres.' });
    if (username.length < 4 || username.length > 15)
      return res
        .status(400)
        .json({ message: 'Usuário precisa conter de 4 a 15 caracteres.' });
    if (password.length < 8 || password.length > 64)
      return res
        .status(400)
        .json({ message: 'Senha precisa conter de 8 a 20 caracteres.' });

    const match = await db.User.findOne({ where: { username: username } });
    if (match === null) {
      const hashPassword = await bcrypt.hash(password, 10);
      await db.User.create({
        name,
        username,
        password: hashPassword,
      });
      console.log(`Usuário: ${username} criado com sucesso!`);
      res.status(201).json({ message: 'Usuário criado com sucesso' });
    } else {
      console.log('O usuário já foi tomado.');
      res.status(409).json({ message: 'Esse username já está em uso' });
    }
  } catch (e) {
    console.log(e);
    res
      .status(500)
      .json({ message: 'Um erro interno ocorreu, tente novamente.' });
  }
}

// Ver perfil
export async function viewUser(req, res) {
  const { id } = req.params;
  const userId = req.userId;

  try {
    const user = await db.User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }
    if (userId !== user.id) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    const totalCarros = await db.Car.count({ where: { UserId: user.id } });

    return res
      .status(200)
      .json({ name: user.name, username: user.username, totalCarros });
  } catch (e) {
    console.log(e);
    res
      .status(500)
      .json({ message: 'Um erro interno ocorreu, tente novamente.' });
  }
}

// Editar perfil
export async function updateUser(req, res) {
  const { id } = req.params;
  const userId = req.userId;
  const { name } = req.body;

  try {
    const user = await db.User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }
    if (userId !== user.id) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }
    if (!name) {
      return res
        .status(400)
        .json({ message: 'O campo Nome não pode ficar vazio.' });
    }

    user.set({ name });
    const camposAlterados = user.changed();

    if (!camposAlterados || camposAlterados.length === 0) {
      return res.status(200).json({ message: 'Nenhuma alteração detectada.' });
    }

    await user.save();
    return res
      .status(200)
      .json({ message: 'Alteração realizada com sucesso!' });
  } catch (e) {
    console.log(e);
    res
      .status(500)
      .json({ message: 'Um erro interno ocorreu, tente novamente.' });
  }
}
