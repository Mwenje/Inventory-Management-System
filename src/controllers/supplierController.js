const { Supplier, Product } = require("../models");
const { body, validationResult } = require("express-validator");

const emailExists = async (email) => {
  const supplier = await Supplier.findOne({ where: { email } });

  if (supplier) {
    throw new Error("Email already in use");
  }
};

exports.createSupplier = [
  body("name").notEmpty().withMessage("Name is required").trim().escape(),
  body("contact").notEmpty().withMessage("Contact is required").trim().escape(),
  body("email")
    .isEmail()
    .withMessage("Valid email is required")
    .normalizeEmail({ gmail_remove_dots: false })
    .custom(emailExists),

  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { name, contact, email } = req.body;
      const supplier = await Supplier.create({ name, contact, email });

      return res.status(201).json({
        success: false,
        message: "Supplier created successfully",
        supplier,
      });
    } catch (error) {
      console.error("Error creating supplier:", error);
      res.status(500).json({ success: false, error: "Internal Server Error" });
    }
  },
];

exports.getSuppliers = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const suppliers = await Supplier.findAll({
      limit: parseInt(limit, 10),
      offset: parseInt(offset, 10),
      include: Product,
    });

    const totalSuppliers = await Supplier.count();

    return res.status(200).json({
      success: true,
      message: "Suppliers retrieved successfully",
      data: suppliers,
      pagination: {
        total: totalSuppliers,
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        totalPages: Math.ceil(totalSuppliers / limit),
      },
    });
  } catch (error) {
    console.error("Error retrieving suppliers:", error);
    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
    });
  }
};

exports.updateSupplier = [
  body("name").optional().notEmpty().withMessage("Name cannot be empty"),
  body("contact").optional().notEmpty().withMessage("Contact cannot be empty"),
  body("email").optional().isEmail().withMessage("Valid email is required"),

  async (req, res) => {
    try {
      const { id } = req.params;

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, contact, email } = req.body;

      const supplier = await Supplier.findByPk(id);

      if (!supplier) {
        return res
          .status(404)
          .json({ success: false, message: "Supplier not found" });
      }

      if (name) supplier.name = name;
      if (contact) supplier.contact = contact;
      if (email) supplier.email = email;

      await supplier.save();

      return res.status(200).json({
        success: true,
        message: "Supplier updated successfully",
        supplier,
      });
    } catch (error) {
      console.error("Error updating supplier:", error);
      return res.status(500).json({
        success: false,
        error: "Internal Server Error",
      });
    }
  },
];

exports.deleteSupplier = async (req, res) => {
  try {
    const { id } = req.params;

    const supplier = await Supplier.findByPk(id);

    if (!supplier) {
      return res.status(404).json({
        success: false,
        message: "Supplier not found",
      });
    }

    await supplier.destroy();

    return res.status(200).json({
      success: true,
      message: "Supplier deleted successfully",
      deletedSupplier: {
        id: supplier.id,
        name: supplier.name,
        contact: supplier.contact,
        email: supplier.email,
      },
    });
  } catch (error) {
    console.error("Error deleting supplier:", error); // Log the error internally
    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
    });
  }
};
