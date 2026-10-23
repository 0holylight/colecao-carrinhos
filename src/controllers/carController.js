import db from "../models/index.js";
import { uploadPhoto, deletePhoto } from "../utils/photoStorage.js";

// createCar

export async function createCar(req, res) {
  const userId = req.userId;
  const { name, collection, color, year } = req.body;
  let photoUrl = null; // [FOTO] guarda o endereço, se houver upload

  try {
    if (!userId)
      return res.status(401).json({ message: "Usuário não autenticado." });
    if (!name)
      return res
        .status(400)
        .json({ message: "Você precisa inserir o nome do seu carrinho." });
    if (!color)
      return res
        .status(400)
        .json({ message: "Você precisa inserir a cor do seu carrinho." });
    if (!year)
      return res
        .status(400)
        .json({ message: "Você precisa inserir o ano do seu carrinho." });

    // Validação de Tipos
    if (typeof name !== "string" || typeof color !== "string")
      return res.status(400).json({
        message: "Um ou mais campos foram preenchidos de forma incorreta.",
      });
    if (collection !== undefined && typeof collection !== "string")
      return res.status(400).json({
        message: "O campo da coleção foi preenchido de forma incorreta.",
      });
    const numConvertido = Number(year);
    if (!Number.isInteger(numConvertido))
      return res
        .status(400)
        .json({ message: "O campo ano foi preenchido de forma incorreta." });

    // Normalização
    const nomeLimpo = name.trim();
    const corLimpa = color.trim();
    const colecaoLimpa = collection?.trim() || null;

    if (!nomeLimpo || !corLimpa)
      return res
        .status(400)
        .json({ message: "Nome e cor não podem ficar em branco." });

    const totalCar = await db.Car.count({ where: { UserId: userId } });

    if (totalCar >= 25) {
      return res
        .status(400)
        .json({ message: "Não há mais espaço na sua coleção." });
    }

    // [FOTO] só envia depois que tudo foi validado
    if (req.file) {
      photoUrl = await uploadPhoto(req.file);
    }

    const createdCar = await db.Car.create({
      name: nomeLimpo,
      collection: colecaoLimpa,
      color: corLimpa,
      year,
      UserId: userId,
      photoUrl,
    });

    return res.status(201).json({
      car: createdCar,
      message: "Seu carrinho foi registrado na coleção!",
    });
  } catch (e) {
    console.log(e);

    // [FOTO] se a foto subiu mas o carro não foi salvo, apaga a foto
    if (photoUrl) {
      try {
        await deletePhoto(photoUrl);
      } catch (erroFoto) {
        console.log("Não foi possível apagar a foto órfã:", erroFoto);
      }
    }

    return res
      .status(500)
      .json({ message: "Algum erro ocorreu durante o registro." });
  }
}

// getCar

export async function getCar(req, res) {
  const userId = req.userId;
  if (!userId)
    return res.status(401).json({ message: "Usuário não autenticado." });

  try {
    const carList = await db.Car.findAll({ where: { UserId: userId } });
    return res.status(200).json({ cars: carList });
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .json({ message: "Um erro ocorreu ao buscar a coleção." });
  }
}

// updateCar

export async function updateCar(req, res) {
  const userId = req.userId;
  const { id } = req.params;
  const { name, year, color, collection } = req.body;

  try {
    const car = await db.Car.findByPk(id);

    if (!userId)
      return res.status(401).json({ message: "Usuário não autenticado." });
    if (!car)
      return res.status(404).json({ message: "Carrinho não encontrado." });
    if (userId !== car.UserId)
      return res.status(404).json({ message: "Carrinho não encontrado." });

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

    // Validação de Tipos
    if (typeof name !== "string" || typeof color !== "string")
      return res.status(400).json({
        message: "Um ou mais campos foram preenchidos de forma incorreta.",
      });
    if (collection !== undefined && typeof collection !== "string")
      return res.status(400).json({
        message: "O campo da coleção foi preenchido de forma incorreta.",
      });
    const numConvertido = Number(year);
    if (!Number.isInteger(numConvertido))
      return res
        .status(400)
        .json({ message: "O campo ano foi preenchido de forma incorreta." });

    // Normalização
    const nomeLimpo = name.trim();
    const corLimpa = color.trim();
    const colecaoLimpa = collection?.trim() || null;

    if (!nomeLimpo || !corLimpa)
      return res
        .status(400)
        .json({ message: "Nome e cor não podem ficar em branco." });

    const existingPhoto = car.photoUrl;

    car.set({
      name: nomeLimpo,
      year,
      color: corLimpa,
      collection: colecaoLimpa,
    });

    // [FOTO] se veio foto nova, envia e troca o endereço
    let novaFoto = null;
    if (req.file) {
      novaFoto = await uploadPhoto(req.file);
      car.set({ photoUrl: novaFoto });
    }

    const camposAlterados = car.changed();

    if (!camposAlterados || camposAlterados.length === 0) {
      return res.status(200).json({ message: "Nenhuma alteração detectada." });
    }

    await car.save();

    // [FOTO] a antiga só é apagada depois que o banco foi atualizado
    if (novaFoto && existingPhoto) {
      try {
        await deletePhoto(existingPhoto);
      } catch (e) {
        console.log("Não foi possível apagar a foto antiga:", existingPhoto);
      }
    }

    return res.status(200).json({
      car: car,
      message: "Alteração realizada com sucesso!",
    });
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .json({ message: "Um erro ocorreu ao tentar alterar." });
  }
}

// deleteCar

export async function deleteCar(req, res) {
  const userId = req.userId;
  const { id } = req.params;

  try {
    const car = await db.Car.findByPk(id);

    if (!userId)
      return res.status(401).json({ message: "Usuário não autenticado." });
    if (!car)
      return res.status(404).json({ message: "Carrinho não encontrado." });
    if (userId !== car.UserId)
      return res.status(404).json({ message: "Carrinho não encontrado." });

    const existingPhoto = car.photoUrl;

    await car.destroy();

    // [FOTO] apaga do Storage, sem derrubar a exclusão se falhar
    if (existingPhoto) {
      try {
        await deletePhoto(existingPhoto);
      } catch (e) {
        console.log("Não foi possível apagar a foto:", existingPhoto);
      }
    }

    return res.status(204).send();
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .json({ message: "Um erro ocorreu ao tentar deletar." });
  }
}

// removeCarPhoto

export async function removeCarPhoto(req, res) {
  const userId = req.userId;
  const { id } = req.params;

  try {
    const car = await db.Car.findByPk(id);

    if (!userId)
      return res.status(401).json({ message: "Usuário não autenticado." });
    if (!car)
      return res.status(404).json({ message: "Carrinho não encontrado." });
    if (userId !== car.UserId)
      return res.status(404).json({ message: "Carrinho não encontrado." });

    if (!car.photoUrl) {
      return res
        .status(400)
        .json({ message: "Não há foto para ser removida." });
    }

    const fotoAntiga = car.photoUrl;
    car.photoUrl = null;
    await car.save();

    // [FOTO] mesma lógica: banco primeiro, arquivo depois
    try {
      await deletePhoto(fotoAntiga);
    } catch (e) {
      console.log("Não foi possível apagar a foto:", fotoAntiga);
    }

    return res.status(200).json({
      car: car,
      message: "Foto removida com sucesso.",
    });
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .json({ message: "Erro ocorreu ao tentar remover a foto." });
  }
}