import express from "express";
import {
  getProducts,
  getLiveProducts,
  getProductDetails,
  buyProduct,
  createProduct,
  editProduct,
  deleteProduct
} from "../controllers/productControllers.js";

const router = express.Router();

router.get("/booth/:boothId", getProducts); // vendor
router.get("/booth/live/:boothId", getLiveProducts); // customer 
router.get("/details/:productId", getProductDetails);// customer * 
router.patch("/buy/:orderId", buyProduct); // customer * 
router.post("/create", createProduct);// vendor *
router.patch("/edit/:productId", editProduct);// vendor 
router.delete("/delete/:productId", deleteProduct) // vendor


export default router;
