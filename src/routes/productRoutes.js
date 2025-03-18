const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

router.get("/", productController.getAllProducts);
router.post("/", productController.createProduct);
router.put("/:id/stock", productController.updateStock);
router.get("/low-stock", productController.getLowStockProducts);

module.exports = router;
