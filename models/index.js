import dbConfig from "../config/config.js";
import Sequelize from "sequelize";
import initUserModel from "../models/user.model.js";

const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
  host: dbConfig.host,
  dialect: dbConfig.dialect,
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.user = initUserModel(sequelize, Sequelize);

export default db;
