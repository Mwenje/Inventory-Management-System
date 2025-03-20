const express = require("express");
const dotenv = require("dotenv");
const sequelize = require("./config/database.js");
const productRoutes = require("./routes/productRoutes.js");
const supplierRoutes = require("./routes/supplierRoutes.js");

// Middleware
dotenv.config(); // Load environment variables
const app = express();
app.use(express.json());

const PORT = process.env.PORT || 8080;

// Routes
app.use("/api/products", productRoutes);
app.use("/api/suppliers", supplierRoutes);

// Sync database and start server
sequelize
  .sync({ force: false })
  .then(() => {
    console.log(`Connected to ${process.env.DB_NAME} Database`);

    // Start the server
    const server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

    // Graceful shutdown
    const shutdown = () => {
      console.log("Shutting down gracefully...");
      server.close(() => {
        console.log("Closed all connections.");
        process.exit(0);
      });
    };

    process.on("SIGINT", shutdown); // Handle Ctrl+C
    process.on("SIGTERM", shutdown); // Handle termination signals
  })
  .catch((error) => {
    console.error("Unable to connect to the database:", error);
    process.exit(1); // Exit the process with failure
  });
