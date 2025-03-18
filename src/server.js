const express = require("express");
const dotenv = require("dotenv");
const sequelize = require("./config/database.js");
const productRoutes = require("./routes/productRoutes.js");

dotenv.config();
const app = express();
app.use(express.json());

const PORT = process.env.PORT || 8080;

app.use("/api/products", productRoutes);

sequelize.sync({ force: false }).then(() => {
  console.log(`Connected to ${process.env.DB_NAME} Database`);

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
