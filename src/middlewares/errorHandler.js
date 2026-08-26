import multer from 'multer';

export function errorHandler(err, req, res, next) {
  if (
    err instanceof multer.MulterError ||
    err.message === 'Apenas imagens são permitidas.'
  ) {
    res
      .status(400)
      .json({
        message:
          'Um erro relacionado ao limite ou a natureza do arquivo ocorreu.',
      });
  } else {
    const type = err.code;
    console.log(type, err);    
    res.status(500).json({ message: 'Um erro interno ocorreu.' });
  }
}
