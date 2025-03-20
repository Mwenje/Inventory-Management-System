const sequelize = require("../config/database");
const Product = require("./product.js");
const Category = require("./category");
const Supplier = require("./supplier");
const Order = require("./order");

//build relationships
Category.hasMany(Product, { foreignKey: "categoryId" });
Product.belongsTo(Category, { foreignKey: "categoryId" });

Supplier.hasMany(Product, { foreignKey: "supplierId" });
Product.belongsTo(Supplier, { foreignKey: "supplierId" });

Product.belongsToMany(Order, { through: "OrderItems" });
Order.belongsToMany(Product, { through: "OrderItems" });

module.exports = { sequelize, Product, Category, Supplier, Order };
