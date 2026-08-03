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
      set(value) {
        this.setDataValue('year', Number(value));
      },
      validate: {
        min: 1968,
        max: new Date().getFullYear(),
      },
    },

    photoUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'Car',
  },
);

export default Car;
