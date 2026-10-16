// Maquina de Crachás
import jwt from "jsonwebtoken";
// import { cookieOptions } from '../controllers/tokenController.js'

export const cookieOptions = {
  httpOnly: true,
  maxAge: 1800000,
  sameSite: "strict", // Pode mudar no deploy
  secure: process.env.NODE_ENV === "production",
};

export function authCookie(res, id) {
  const token = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30m",
  });

  res.cookie("token", token, cookieOptions);
}
