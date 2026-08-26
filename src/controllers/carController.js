import db from '../models/index.js';

// createCar

export async function createCar(req, res) {
  const userId = req.userId;
  const { name, collection, color, year } = req.body;
  const photo = req.file?.filename;

  try {
    if (!userId)
      return res.status(401).json({ message: 'Usuário não autenticado.' });
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

    var totalCar = await db.Car.count({ where: { UserId: userId }})

    if ( totalCar >= 25 ) {
      return res
        .status(400)
        .json({ message: 'Não há mais espaço na sua coleção.' })
    }

    await db.Car.create({
      name,
      collection,
      color,
      year,
      UserId: userId,
      photoUrl: photo,
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

// getCar

export async function getCar(req, res) {
  const userId = req.userId;
  if (!userId)
    return res.status(401).json({ message: 'Usuário não autenticado.' });

  try {
    const carList = await db.Car.findAll({ where: { UserId: userId } });
    return res.status(200).json({ cars: carList });
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .json({ message: 'Um erro ocorreu ao buscar a coleção.' });
  }
}

// updateCar

export async function updateCar(req, res) {
  const userId = req.userId;
  const { id } = req.params;
  const photo = req.file?.filename;
  const { name, year, color, collection } = req.body;

  try {
    const car = await db.Car.findByPk(id);

    if (!userId)
      return res.status(401).json({ message: 'Usuário não autenticado.' });
    if (!car)
      return res.status(404).json({ message: 'Carrinho não encontrado.' });
    if (userId !== car.UserId)
      return res.status(404).json({ message: 'Carrinho não encontrado.' });

    if (!name)
      return res
        .status(400)
        .json({ message: 'O campo "nome" não pode ficar vazio.' });
    if (!color)
      return res
        .status(400)
        .json({ message: 'O campo "cor" não pode ficar vazio.' });
    if (!year)
      return res
        .status(400)
        .json({ message: 'O campo "ano" não pode ficar vazio.' });

    if (photo) {
      car.set({ name, year, color, collection, photoUrl: photo });
    } else {
      car.set({ name, year, color, collection });
    }
    const camposAlterados = car.changed();

    if (!camposAlterados || camposAlterados.length === 0) {
      return res.status(200).json({ message: 'Nenhuma alteração detectada.' });
    }

    await car.save();
    return res
      .status(200)
      .json({ message: 'Alteração realizada com sucesso!' });
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .json({ message: 'Um erro ocorreu ao tentar alterar.' });
  }
}

// deleteCar

export async function deleteCar(req, res) {
  const userId = req.userId;
  const { id } = req.params;

  try {
    const car = await db.Car.findByPk(id);

    if (!userId)
      return res.status(401).json({ message: 'Usuário não autenticado.' });
    if (!car)
      return res.status(404).json({ message: 'Carrinho não encontrado.' });
    if (userId !== car.UserId)
      return res.status(404).json({ message: 'Carrinho não encontrado.' });

    await car.destroy();
    return res.status(204).send();
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .json({ message: 'Um erro ocorreu ao tentar deletar.' });
  }
}
