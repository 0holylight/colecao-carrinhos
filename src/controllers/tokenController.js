import db from '../models/index.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export async function loginUser(req, res) {
  const { username, password } = req.body;
  const msg = 'Usuário ou Senha não enviado';

  try {
    if (!username) return res.status(400).json({ message: msg });
    if (!password) return res.status(400).json({ message: msg });

    const match = await db.User.findOne({ where: { username: username } });

    if (!match) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    } else {
      if (!(await bcrypt.compare(password, match.password))) {
        return res.status(401).json({ message: 'Credenciais inválidas' });
      } else {
        const token = jwt.sign({ id: match.id }, process.env.JWT_SECRET, {
          expiresIn: '7d',
        });

        res.cookie('token', token, {
          httpOnly: true,
          maxAge: 1800000,
        });

        return res
          .status(200)
          .json({ message: 'Login realizado com sucesso.' });
      }
    }
  } catch (e) {
    console.log(e);
    res
      .status(500)
      .json({ message: 'Um erro interno ocorreu, tente novamente.' });
  }
}
