import Sequelize from 'sequelize';
import dotenv from 'dotenv';

const sequelize = new Sequelize('database', 'username', 'password', {
    host: 'localhost',
    dialect: 'postgres'
})

export default sequelize
