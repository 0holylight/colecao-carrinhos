/*
Importar o DataTypes e o Model do Sequelize (você vai usar a sintaxe de classe, class Usuario extends Model)
Importar a conexão (sequelize) que criamos em database.js
Dentro do .init(), declarar os campos da sua modelagem: nome, usuario, senha 
(lembra que decidimos renomear aquele campo "Usuário" pra evitar ambiguidade, ou você prefere manter como estava no desenho original?)
Passar { sequelize, modelName: 'usuario' } como segundo argumento
Exportar o Model no final (export default Usuario, já que estamos em ES Modules)
*/

import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';

// Pela documentação, temos:

// Models can be defined in two equivalent ways in Sequelize:

// Calling sequelize.define(modelName, attributes, options)
// Extending Model and calling init(attributes, options)

class User extends Model {}

User.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,  
      unique: true,    
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,      
    }
  },
  {
    sequelize,
    modelName: 'User',
  },
);

export default User;