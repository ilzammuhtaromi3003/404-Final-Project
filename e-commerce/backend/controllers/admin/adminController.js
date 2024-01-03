// adminController.js
const { PrismaClient } = require("../../prisma/generated/client");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

async function loginController(req, res) {
  try {
    const { username, password } = req.body;

    // Cari admin berdasarkan username
    const admin = await prisma.admin.findFirst({
      where: { username },
    });

    // Periksa apakah admin ditemukan dan password sesuai
    if (!admin || !(await bcrypt.compare(password, admin.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Buat token JWT
    const token = jwt.sign({ adminId: admin.admin_id }, "secret", {
      expiresIn: "1d",
    });

    // Kirim respons dengan token
    res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

async function registerController(req, res) {
  try {
    const { username, password } = req.body;

    // Hash password sebelum menyimpannya
    const hashedPassword = await bcrypt.hash(password, 10);

    // Simpan admin baru ke database
    const newAdmin = await prisma.admin.create({
      data: {
        username,
        password: hashedPassword,
      },
    });

    res
      .status(201)
      .json({ message: "Admin registered successfully", admin: newAdmin });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

function logoutController(req, res) {
  res.status(200).json({ message: "Logout successful" });
}

module.exports = {
  loginController,
  registerController,
  logoutController,
};
