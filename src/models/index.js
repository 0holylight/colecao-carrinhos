// De acordo com a leitura feita na documentação do Sequelize,
// dentre as diversas formas de se estabelecer relacionamentos,
// o A.hasMany(B) é o mais adequado para o projeto.

import sequelize from '../config/database.js';

import User from './User.js'
import Car from './Car.js'

// Usuário 1 : n Carros
User.hasMany(Car, { onDelete: 'CASCADE' });
// Carros n : 1 Usuário
Car.belongsTo(User, { onDelete: 'CASCADE' });

/* O que foi feito no PostgreS? 

CREATE TABLE IF NOT EXISTS "User" (
   ... 
);
CREATE TABLE IF NOT EXISTS "Car" (
   ... 
  "UserId" INTEGER REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
   ... 
); 

*/

const db = {
  User,
  Car,
  sequelize
}

export default db;

