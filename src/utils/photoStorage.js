import crypto from "crypto";
import sharp from "sharp";
import { supabase } from "../config/supabase.js";

const BUCKET = "car-photos";
const EXTENSOES = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/gif": "gif",
};

export async function uploadPhoto(file) {
  // 1. Remove os metadados (GPS) reprocessando a imagem
  let conteudo = file.buffer;
  if (file.mimetype !== "image/gif") {
    conteudo = await sharp(file.buffer).rotate().toBuffer();
  }

  // 2. Gera um nome único
  const nome = `${crypto.randomUUID()}.${EXTENSOES[file.mimetype]}`;

  // 3. Envia pro bucket
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(nome, conteudo, { contentType: file.mimetype });

  if (error) throw error;

  // 4. Devolve o endereço público
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(nome);
  return data.publicUrl;
}

export async function deletePhoto(photoUrl) {
  if (!photoUrl) return;

  const nome = photoUrl.split("/").pop();
  const { error } = await supabase.storage.from(BUCKET).remove([nome]);

  if (error) throw error;
}