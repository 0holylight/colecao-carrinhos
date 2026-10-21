import db from "../models/index.js";
import bcrypt from "bcrypt";
import { cookieOptions, authCookie } from "../utils/authCookie.js";

export async function loginUser(req, res) {
  const { username, password } = req.body;
  const msg = "Usuário ou Senha não enviado";

  try {
    if (!username) return res.status(400).json({ message: msg });
    if (!password) return res.status(400).json({ message: msg });

    // Validação de tipos
    if (typeof username !== "string" || typeof password !== "string")
      return res.status(400).json({ message: "Um ou mais campos foram preenchidos de forma incorreta." });

    const match = await db.User.findOne({ where: { username: username } });

    if (!match) {
      return res.status(401).json({ message: "Credenciais inválidas" });
    } else {
      const userRes = {
        id: match.id,
        name: match.name,
        username: match.username,
      };

      if (!(await bcrypt.compare(password, match.password))) {
        return res.status(401).json({ message: "Credenciais inválidas" });
      } else {
        authCookie(res, match.id);

        return res.status(200).json({
          user: userRes,
          message: "Login realizado com sucesso.",
        });
      }
    }
  } catch (e) {
    console.log(e);
    res
      .status(500)
      .json({ message: "Um erro interno ocorreu, tente novamente." });
  }
}

export async function logoutUser(req, res) {
  try {
    res.clearCookie("token", cookieOptions);
    res.status(200).json({ message: "Logout realizado com sucesso!" });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Ocorreu um erro com o Logout." });
  }
}
