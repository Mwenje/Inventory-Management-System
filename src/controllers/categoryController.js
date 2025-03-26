const { Category } = require("../models");
const { body, validationResult } = require("express-validator");

exports.createCategory = [
  body("name").notEmpty().withMessage("Name is required."),
  body("decription")
    .optional()
    .isString()
    .withMessage("Description must be a string."),

  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
      const { name, description } = req.body;

      const category = await Category.create({ name, description });

      res.status(201).json({
        success: true,
        message: "Category created successfully.",
        category,
      });
    } catch (error) {
      console.error("Error creating category:", error);

      if (error.name === "SequelizeUniqueConstraintError") {
        return res.status(409).json({
          success: false,
          message: "Category name must be unique.",
        });
      }
      return res
        .status(500)
        .json({ success: false, error: "Internal Server Error" });
    }
  },
];

exports.getCategories = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const categories = await Category.findAll({
      limit: parseInt(limit, 10),
      offset: parseInt(offset, 10),
    });

    const totalCategories = await Category.count();

    return res.status(200).json({
      success: true,
      message: "Categories retrieved successfully.",
      data: categories,
      pagination: {
        total: totalCategories,
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        totalPages: Math.ceil(totalCategories / limit),
      },
    });
  } catch (error) {
    console.error("Error retrieving categories:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

exports.updateCategory = [
  body("name").optional().notEmpty().withMessage("Name cannot be empty."),
  body("description")
    .optional()
    .isString()
    .withMessage("Description must be a string."),

  async (req, res) => {
    try {
      const { id } = req.params;
      const { name, description } = req.body;

      const category = await Category.findByPk(id);

      if (!category) {
        return res.status(404).json({
          success: false,
          message: "Category not found",
        });
      }

      // Update category fields if provided
      if (name) category.name = name;
      if (description) category.description = description;

      await category.save();

      return res.status(200).json({
        success: true,
        message: "Category updated successfully.",
        category,
      });
    } catch (error) {
      console.error("Error updating category:", error);
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  },
];

exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findByPk(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    await category.destroy();

    return res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting category:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
