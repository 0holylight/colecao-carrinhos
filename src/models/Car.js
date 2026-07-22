import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';

class Car extends Model {}

Car.init(
  {

    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    collection: {
      type: DataTypes.STRING,
      allowNull: true,   
    },

    color: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    
    year: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1968,
        max: new Date().getFullYear()
      } 
    }

  },
  {
    sequelize,
    modelName: 'Car',
  },
);

export default Car;