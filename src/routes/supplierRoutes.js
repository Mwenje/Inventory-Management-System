const express = require("express");
const router = express.Router();
const supplierController = require("../controllers/supplierController");

// Route to create a new supplier
router.post("/", supplierController.createSupplier);

// Route to get all suppliers
router.get("/", supplierController.getSuppliers);

// Route to update a supplier by ID
router.put("/:id", supplierController.updateSupplier);

// Route to delete a supplier by ID
router.delete("/:id", supplierController.deleteSupplier);

module.exports = router;
