const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Category = sequelize.define("category", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: {
      args: true,
      msg: "Category name must be unique.",
    },
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

module.exports = Category;
