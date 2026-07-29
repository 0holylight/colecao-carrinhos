/*
express.Router() em vez do app direto
Importar a função do controller
router.post('/', suaFuncao) — sem o prefixo /usuarios aqui
export default router
*/

import express from 'express';

import { registerUser } from '../controllers/userController.js';

const router = express.Router();

// Aqui eu digo que ao receber um post no endereço '/',
// que a função registerUser seja executada para tratar o que for "POSTado"
router.post('/', registerUser); // Isso vai gerar resultado lá no app.js

export default router;
