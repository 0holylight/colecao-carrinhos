// config do multer

import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads');
  },
  filename(req, file, cb) {
    const finalUnico = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const extensao = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + finalUnico + extensao);
  },
});

const upload = multer({ storage: storage });

export default upload;
