const { Product, Supplier } = require("../models");
const { Op } = require("sequelize");

exports.getAllProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const products = await Product.findAll({
      limit: parseInt(limit),
      offset: offset,
      include: Supplier,
    });

    if (products.length === 0) {
      return res.status(404).json({ message: "No Products Found." });
    }

    res.status(200).json(products);
  } catch (error) {
    console.log(error);

    res.status(500).json({ error: "Server Error" });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, stock } = req.body;

    if (!name || !description || !price || !stock) {
      return res.status(400).json({
        error: "All fields (name, description, price, stock) are required.",
      });
    }

    if (isNaN(price) || price <= 0) {
      return res
        .status(400)
        .json({ error: "Price must be a positive number." });
    }

    if (!Number.isInteger(stock) || stock < 0) {
      return res
        .status(400)
        .json({ error: "Stock must be a non-negative integer." });
    }

    const product = await Product.create({
      name,
      description,
      price,
      stock,
    });

    // Respond with the newly created product
    res.status(201).json(product);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server Error" });
  }
};

exports.updateStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { stock } = req.body;

    if (isNaN(stock) || stock < 0 || !Number.isInteger(stock)) {
      return res.status(400).json({
        error: "Stock must be a non-negative integer.",
      });
    }

    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    product.stock += stock;
    await product.save();

    res.status(200).json({
      message: "Stock updated successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

exports.getLowStockProducts = async (req, res) => {
  try {
    // Query for products with stock less than 10
    const products = await Product.findAll({
      where: {
        stock: {
          [Op.lt]: 10, // Find products with stock less than 10
        },
      },
    });

    // If no low-stock products are found
    if (products.length === 0) {
      return res
        .status(404)
        .json({ message: "No products with low stock found." });
    }

    // Return the found products
    res.status(200).json(products);
  } catch (error) {
    // Handle any errors
    res.status(500).json({ error: error.message });
  }
};
