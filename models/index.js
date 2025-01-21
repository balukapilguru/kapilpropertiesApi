const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../db/dbconnect");

const db = {};

// Define models
db.UserInfo = require("./userInfoModel")(sequelize, DataTypes);

// Sequelize instance
db.sequelize = sequelize;

// Export the database object
module.exports = db;
