import db from '../models/index.js';

export async function createCar(req, res) {
  // Carro será criado conforme o ID de usuário que chegou

  // Dados do Middleware
  const userId = req.userId;

  // Dados do Form do Carrinho criado
  const { name, collection, color, year } = req.body;

  // Validação dos Campos, complementando a do front end e backend
  try {
    if (!name)
      return res
        .status(400)
        .json({ message: 'Você precisa inserir o nome do seu carrinho.' });
    if (!color)
      return res
        .status(400)
        .json({ message: 'Você precisa inserir a cor do seu carrinho.' });
    if (!year)
      return res
        .status(400)
        .json({ message: 'Você precisa inserir o ano do seu carrinho.' });

    await db.Car.create({
      name,
      collection,
      color,
      year,
      UserId: userId,
    });

    return res
      .status(201)
      .json({ message: 'Seu carrinho foi registrado na coleção!' });
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .json({ message: 'Algum erro ocorreu durante o registro.' });
  }
}
