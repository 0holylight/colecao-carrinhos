import sequelize from '../config/database.js';

import User from './User.js';
import Car from './Car.js';

// Usuário 1 : n Carros
User.hasMany(Car, { onDelete: 'CASCADE' });
// Carros n : 1 Usuário
Car.belongsTo(User, {
  foreignKey: { allowNull: false },
  onDelete: 'CASCADE',
});

const db = {
  User,
  Car,
  sequelize,
};

export default db;
