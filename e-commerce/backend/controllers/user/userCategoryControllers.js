const { PrismaClient } = require("../../prisma/generated/client");
const prisma = new PrismaClient();

const getCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      where: { deleted: false },
    });
    res.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getCategoryById = async (req, res) => {
  try {
    const categoryId = parseInt(req.params.id, 10);
    const category = await prisma.category.findUnique({
      where: {
        category_id: categoryId,
      },
    });

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.json(category);
  } catch (error) {
    console.error("Error fetching category by ID:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { getCategories, getCategoryById };
