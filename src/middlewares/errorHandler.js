import multer from "multer";

export function errorHandler(err, req, res, next) {
  if (
    err instanceof multer.MulterError ||
    err.message === "Apenas imagens são permitidas."
  ) {
    res.status(400).json({
      message:
        "Um erro relacionado ao limite ou a natureza do arquivo ocorreu.",
    });
  } else if (err.type === "entity.parse.failed") {
    res.status(400).json({ message: "Formato de dados inválido." });
  } else {
    const code = err.code;
    console.log(code, err);
    res.status(500).json({ message: "Um erro interno ocorreu." });
  }
}
