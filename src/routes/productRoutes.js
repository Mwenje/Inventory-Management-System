const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

// Route to get all products
router.get("/", productController.getAllProducts);

// Route to create a new product
router.post("/", productController.createProduct);

// Route to update the stock of a product by ID
router.put("/:id/stock", productController.updateStock);

// Route to get products with low stock
router.get("/low-stock", productController.getLowStockProducts);

// Route to delete a product by ID
router.delete("/:id", productController.deleteProduct);

module.exports = router;
