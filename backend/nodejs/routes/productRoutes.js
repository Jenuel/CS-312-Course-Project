import express from "express";
import {
  getProducts,
  getProductDetails,
  buyProduct,
  createProduct,
  editProduct,
  deleteProduct
} from "../controllers/productControllers.js";

const router = express.Router();

router.get("/booth/:boothId", getProducts); // vendor * && customer *
router.get("/details/:productId", getProductDetails);// customer * 
router.patch("/buy/:productId", buyProduct); // customer * 
router.post("/create", createProduct);// vendor *
router.patch("/edit/:productId", editProduct);// vendor 
router.delete("/delete/:productId", deleteProduct) // vendor


export default router;
