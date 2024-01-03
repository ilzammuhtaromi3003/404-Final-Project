const { PrismaClient } = require("../../prisma/generated/client");
const prisma = new PrismaClient();

const categoryController = {
  getAll: async (req, res) => {
    const categorys = await prisma.category.findMany({
      where: { deleted: false },
    });
    res.status(200).json({ categorys });
  },

  getByID: async (req, res) => {
    try {
      const { id } = req.params;
      const category = await prisma.category.findUnique({
        where: { category_id: Number(id) },
      });
      res.status(200).json(category);
    } catch (err) {
      console.log(err);
      res.status(400).json({ message: "Something went wrong" });
    }
  },

  addCategory: async (req, res) => {
    try {
      const { category_name } = req.body;
      const category = await prisma.category.create({
        data: {
          category_name,
        },
      });
      res
        .status(201)
        .json({ message: "category data successfuly created", category });
    } catch (err) {
      console.log(err);
      res.status(400).json({ message: "Something went wrong" });
    }
  },

  editCategory: async (req, res) => {
    try {
      const { id } = req.params;
      const { category_name } = req.body;
      const category = await prisma.category.update({
        where: { category_id: Number(id) },
        data: {
          category_name,
        },
      });
      res
        .status(200)
        .json({ message: "category data successfuly updated", category });
    } catch (err) {
      console.log(err);
      res.status(400).json({ message: "Something went wrong" });
    }
  },

  deleteCategory: async (req, res) => {
    try {
      const { id } = req.params;
      const category = await prisma.category.update({
        where: {
          category_id: Number(id),
        },
        data: {
          deleted: true,
        },
      });
      res
        .status(200)
        .json({ message: "category data successfuly deleted", category });
    } catch (err) {
      console.log(err);
      res.status(400).json({ message: "Something went wrong" });
    }
  },
};

module.exports = categoryController;
