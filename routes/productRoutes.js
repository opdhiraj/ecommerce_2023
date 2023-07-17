import express from "express";
import {
  createProductController,
  deleteProductController,
  getProductController,
  getSingleProduct,
  productCountController,
  productFiltersController,
  productListController,
  productPhotoController,
  updateProductController,
} from "../controllers/productController.js";
// import productPhotoController from "../controllers/productController.js";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import formidable from "express-formidable";
// creating router object
const router = express.Router();

//routes
router.post(
  "/create-product",
  requireSignIn,
  isAdmin,
  formidable(),
  createProductController
);

//routes
router.put(
  "/update-product/:pid",
  requireSignIn,
  isAdmin,
  formidable(),
  updateProductController
);

//get all products
router.get("/get-product", getProductController);

//get single products
router.get("/get-product/:slug", getSingleProduct);

//get photo
router.get("/product-photo/:pid", productPhotoController);

//delete  product
router.delete("/delete-product/:pid", deleteProductController);

//filter routes
router.post("/product-filters", productFiltersController);

//product count
router.get("/product-count", productCountController);

//product per page
router.get("/product-list/:page", productListController);
export default router;
