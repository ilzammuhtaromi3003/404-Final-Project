const jwt = require("jsonwebtoken");
const { PrismaClient } = require("../prisma/generated/client");

const prisma = new PrismaClient();

async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, "secret");

    const adminId = decoded.adminId;

    // Cek apakah admin dengan ID sesuai ada di database
    const admin = await prisma.admin.findUnique({
      where: { admin_id: adminId },
    });

    if (!admin) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Menambahkan informasi admin ke objek req untuk digunakan oleh handler rute selanjutnya
    req.admin = admin;

    // Melanjutkan ke handler rute selanjutnya
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: "Unauthorized" });
  }
}

function authenticateToken(req, res, next) {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  jwt.verify(
    token,
    process.env.JWT_SECRET || "your-default-secret",
    (err, user) => {
      if (err) {
        return res.status(403).json({ message: "Forbidden" });
      }

      req.user = user;
      next();
    }
  );
}

module.exports = { authenticateToken, authMiddleware };
