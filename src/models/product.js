const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Product = sequelize.define("product", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  lowStock: {
    type: DataTypes.VIRTUAL,
    get() {
      return this.stock < 10 ? "low stock" : "sufficient stock";
    },
  },
});

module.exports = Product;
