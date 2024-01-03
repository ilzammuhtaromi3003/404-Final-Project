const express = require("express");
const router = express.Router();
const prisma = require("../prisma/generated/client");

const adminRouter = require("./admin/admin");

const productRouter = require("./product");
const userRouter = require("./admin/user");
const orderRouter = require("./admin/order");
const promotionRouter = require("./admin/promoRoutes");
const affiliateRouter = require("./admin/affiliateRoutes");

const shoppingCartRoutes = require("./user/shoppingCartRoutes");
const userAuthRoutes = require("./user/userAuthenticationRoutes");
const orderRoutes = require("./user/orderRoutes");
const proofOfPaymentRoutes = require("./user/proofOfPaymentRoutes");
const userProductRoutes = require("./user/productRoutes");

const rajaOngkirRoutes = require("./rajaOngkirRoutes");
const shippingRoutes = require("./user/shippingRoutes");

const axios = require("axios");

router.use((req, res, next) => {
  req.prisma = prisma;
  next();
});

router.use("/admin", adminRouter);
router.use("/product", productRouter);
router.use("/user", userRouter);
router.use("/order", orderRouter);
router.use("/promo", promotionRouter);
router.use("/affiliate", affiliateRouter);

router.use("/shoppingCart", shoppingCartRoutes);
router.use("/userauth", userAuthRoutes);
router.use("/user/orders", orderRoutes);
router.use("/user", proofOfPaymentRoutes);
router.use("/users", userProductRoutes);

router.use("/api", rajaOngkirRoutes);
router.use("/shipping", shippingRoutes);

//raja ongkir province
router.get("/rajaongkir/province", async (req, res) => {
  try {
    const response = await axios.get(
      "https://api.rajaongkir.com/starter/province",
      {
        headers: {
          key: "ae0828a345b0ca66f2e0de4a84341cfa",
        },
      }
    );
    res.json(response.data.rajaongkir.results);
  } catch (error) {
    console.error("Error fetching provinces:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//raja ongkir city
router.get("/rajaongkir/city", async (req, res) => {
  const { provinceId } = req.query;

  if (!provinceId) {
    return res.status(400).json({ error: "Province ID is required" });
  }

  try {
    const response = await axios.get(
      `https://api.rajaongkir.com/starter/city?province=${provinceId}`,
      {
        headers: {
          key: "ae0828a345b0ca66f2e0de4a84341cfa",
        },
      }
    );
    res.json(response.data.rajaongkir.results);
  } catch (error) {
    console.error("Error fetching cities:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
router.get("/rajaongkir/citydetail", async (req, res) => {
  const { province, id } = req.query;

  if (!province) {
    return res.status(400).json({ error: "Province ID is required" });
  }

  try {
    const response = await axios.get(
      `https://api.rajaongkir.com/starter/city?id=${id}&province=${province}`,
      {
        headers: {
          key: "ae0828a345b0ca66f2e0de4a84341cfa",
        },
      }
    );
    res.json(response.data.rajaongkir.results);
  } catch (error) {
    console.error("Error fetching cities:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router;
module.exports = router;
