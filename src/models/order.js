const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Order = sequelize.define("order", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  customerName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  totalAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  totalPrice: {
    type: DataTypes.VIRTUAL,
    get() {
      return this.OrderItems
        ? this.OrderItems.reduce((sum, item) => sum + item.totalPrice, 0)
        : 0;
    },
  },
});

module.exports = Order;
