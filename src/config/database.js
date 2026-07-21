import Sequelize from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();
/* Esse cara é quem puxa o .env e "encaixa" as informações 
dentro de cada chamada de process.env.[variavel] */

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: 'postgres',
  },
);

export default sequelize;

sequelize.authenticate()
  .then(() => console.log('Conexão com o banco estabelecida com sucesso!'))
  .catch((erro) => console.error('Não foi possível conectar ao banco:', erro));