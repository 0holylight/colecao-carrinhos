import multer from 'multer';
import path from 'path';
import fs from 'fs';

const UPLOADS_DIR = 'uploads';

fs.mkdirSync(UPLOADS_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, UPLOADS_DIR);
  },
  filename(req, file, cb) {
    const finalUnico = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const extensao = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + finalUnico + extensao);
  },
});

const upload = multer({ storage: storage });

export default upload;
