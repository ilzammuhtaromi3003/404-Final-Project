const { PrismaClient } = require("../../prisma/generated/client");
const prisma = new PrismaClient();

const UserController = {
  getAllUsers: async (req, res) => {
    const users = await prisma.user.findMany();
    res.json(users);
  },

  getUserById: async (req, res) => {
    const userId = parseInt(req.params.id);
    const user = await prisma.user.findUnique({
      where: { user_id: userId },
    });

    if (!user) {
      res.status(404).json({ message: 'User not found' });
    } else {
      res.json(user);
    }
  },

  updateUser: async (req, res) => {
    const userId = parseInt(req.params.id);
    const updatedUser = await prisma.user.update({
      where: { user_id: userId },
      data: req.body,
    });

    res.json(updatedUser);
  },

  deleteUser: async (req, res) => {
    const userId = parseInt(req.params.id);
    await prisma.user.delete({
      where: { user_id: userId },
    });

    res.json({ message: 'User deleted successfully' });
  },
};

module.exports = UserController;
