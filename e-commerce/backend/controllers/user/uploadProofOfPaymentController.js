const { PrismaClient } = require("../../prisma/generated/client");
const prisma = new PrismaClient();
const multer = require("multer");
const path = require("path");

// Set up multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

// Set up multer upload
const upload = multer({ storage: storage });

// Middleware to handle file upload
const uploadMiddleware = upload.single("proofOfPaymentFile");

async function uploadProofOfPayment(req, res) {
  const orderId = parseInt(req.params.orderId, 10);

  // Handle the file upload
  uploadMiddleware(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      // A multer error occurred
      return res.status(400).json({ error: err.message });
    } else if (err) {
      // An unknown error occurred
      return res.status(500).json({ error: "Internal Server Error" });
    }

    // File upload successful
    try {
      const image = req.file.filename;

      // Create proof of payment record
      const proofOfPayment = await prisma.proofsOfPayment.create({
        data: {
          order: {
            connect: {
              order_id: orderId,
            },
          },
          image: image,
          payment_status: false,
          promo_usage_updated: true,
        },
      });

      res
        .status(201)
        .json({
          message: "Proof of payment uploaded successfully",
          proofOfPayment,
        });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
}

module.exports = { uploadProofOfPayment };
