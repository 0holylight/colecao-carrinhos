import "dotenv/config";
import app from "./app.js";
import db from "./models/index.js";

const PORT = process.env.PORT || 3001;

try {
  await db.sequelize.sync();
  const server = app.listen(PORT);
  server.on('error', (err) => {
    if (err) console.log(`Ocorreu um erro: ${err}`);
  });
} catch (e) {
  console.log(e);
  process.exit(1);
}
