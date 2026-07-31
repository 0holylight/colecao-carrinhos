// " Abrir porta e começar a escutar "

import app from './app.js';
import db from './models/index.js';

const PORT = 3001;

try {
  await db.sequelize.sync({ alter: true });
  const server = app.listen(PORT);
  server.on('error', (err) => {
    if (err) console.log(`Ocorreu um erro: ${err}`)
    });  
} catch (e) {
  console.log(e);
  process.exit(1);
}
