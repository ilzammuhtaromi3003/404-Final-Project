const express = require("express");
const productController = require("../controllers/admin/productController");
const authMiddleware = require("../middleware/authMiddleWare");
const mtr = require("../middleware/upload");
const router = express.Router();

router.route("/").get(productController.getAllProduct);
router.route("/detail").get(productController.getAllProductDetails);
router.route("/").post(mtr.upload.single("image"), productController.createProduct);
router.route("/:id").get(productController.getByID);
router.route("/:id").delete(productController.deleteProduct);
router.route("/:id").put(mtr.upload.single("image"),productController.updateProduct);
router.route("/category/:category_id").get(productController.getByCategory);
router.route("/search/:productName").get(productController.searchProductByName);
router.route("/filter/:categoryName").get(productController.filterProductByCategory);
router.route('/categories/names').get(productController.getAllCategoryNames);
router.route('/warehouses/names').get(productController.getAllWarehouseNames);



module.exports = router;
