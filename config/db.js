import { Sequelize } from "sequelize";
import config from "./config";

const DB_NAME = config.DB_NAME
const DB_USER = config.DB_USER
const DB_PASSWORD = config.DB_PASSWORD
const DB_PORT = config.DB_PORT
const DB_HOST = config.DB_HOST

//Passing parameters separately (other dialects)
const db = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
    host: DB_HOST,
    port:DB_PORT,
    dialect: 'mysql',
    define:{
        timestamps: true
    },
    pool:{
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});


export default db