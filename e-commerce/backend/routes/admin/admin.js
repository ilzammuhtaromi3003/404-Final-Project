const express = require("express");
const {
  loginController,
  registerController,
  logoutController,
} = require("../../controllers/admin/adminController");
const warehouseController = require("../../controllers/admin/warehouseController");
const categoryController = require("../../controllers/admin/categoryCotroller");
const productController = require("../../controllers/admin/productController");
const { authMiddleware } = require("../../middleware/authMiddleWare");
const mtr = require("../../middleware/upload");

const router = express.Router();

router.post("/login", loginController);
router.post("/register", registerController);
router.post("/logout", logoutController);

//midlewareAdmin
router.use(authMiddleware);

//warehouse
router
  .route("/warehouse")
  .get(warehouseController.getAll)
  .post(warehouseController.addWarehouse);

router
  .route("/warehouse/:id")
  .get(warehouseController.getByID)
  .put(warehouseController.editWarehouse)
  .delete(warehouseController.deleteWarehouse);

//category
router
  .route("/category")
  .get(categoryController.getAll)
  .post(categoryController.addCategory);

router
  .route("/category/:id")
  .get(categoryController.getByID)
  .put(categoryController.editCategory)
  .delete(categoryController.deleteCategory);

//product
// router
//   .route("/product")
//   .get(productController.getAllProduct)
//   .post(mtr.upload.single("image"), productController.createProduct);

// router
//   .route("/product/:id")
//   .get(productController.getByID)
//   .put(productController.updateProduct)
//   .delete(productController.deleteProduct);

router
  .route("/product/category/:category_id")
  .get(productController.getByCategory);
module.exports = router;
