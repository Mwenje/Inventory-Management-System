const { Product, Supplier } = require("../models");
const { Op } = require("sequelize");
const { body, validationResult } = require("express-validator");
const { ResultWithContextImpl } = require("express-validator/lib/chain");

exports.getAllProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const parsedPage = parseInt(page, 10);
    const parsedLimit = parseInt(limit, 10);

    if (parsedPage < 1 || parsedLimit < 1) {
      return res
        .status(400)
        .json({ message: "Page and limit must be positive integers." });
    }

    const offset = (parsedPage - 1) * parsedLimit;

    const products = await Product.findAll({
      limit: parsedLimit,
      offset: offset,
      include: Supplier,
    });

    // Get total count of products
    const totalProducts = await Product.count();

    if (products.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No Products Found." });
    }

    res.status(200).json({
      success: true,
      message: "Products retrieved successfully.",
      data: products,
      pagination: {
        total: totalProducts,
        page: parsedPage,
        limit: parsedLimit,
        totalPages: Math.ceil(totalProducts / parsedLimit),
      },
    });
  } catch (error) {
    console.error("Error retrieving products:", error); // Log the error internally
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

exports.createProduct = [
  body("name").notEmpty().withMessage("Name is required."),
  body("description").notEmpty().withMessage("Description is required."),
  body("price")
    .isFloat({ gt: 0 })
    .withMessage("Price must be a positive number."),
  body("stock")
    .isInt({ min: 0 })
    .withMessage("Stock must be a non-negative integer."),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { name, description, price, stock } = req.body;

      const product = await Product.create({ name, description, price, stock });

      res.status(201).json({
        success: true,
        message: "Product created successfully.",
        product,
      });
    } catch (error) {
      console.error("Error creating product:", error);
      res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    }
  },
];

exports.updateStock = [
  body("stock")
    .isInt({ min: 0 })
    .withMessage("Stock must be a non-negative integer."),

  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { id } = req.params;
      const { stock } = req.body;

      const product = await Product.findByPk(id);

      if (!product) {
        return res
          .status(404)
          .json({ success: false, message: "Product not found" });
      }

      product.stock = stock;
      await product.save;

      res.status(200).json({
        success: true,
        message: "Stock updated successfully",
        product,
      });
    } catch (error) {
      console.error("Error updating stock:", error);
      res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    }
  },
];

exports.getLowStockProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      where: {
        stock: {
          [Op.lt]: 10, // Find products with stock less than 10
        },
      },
    });

    // If no low-stock products are found
    if (products.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No products with low stock found.",
      });
    }

    // Return the found products
    res.status(200).json({
      success: true,
      message: "Low stock products retrieved successfully.",
      data: products,
    });
  } catch (error) {
    console.error("Error retrieving low stock products:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByPk(id);

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    //delete the product
    await product.destroy();

    // Respond with a success message
    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
      deletedProduct: {
        id: product.id,
        name: product.name,
      },
    });
  } catch (error) {
    console.error("Error deleting product:", error); // Log the error internally
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
