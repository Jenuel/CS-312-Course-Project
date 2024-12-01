import express from "express";
import { getProducts, getProductDetails, buyProduct, createProduct, editProduct, changeStatusProduct, getVendorProducts } from "../controllers/productControllers.js";

const router = express.Router();

router.get("/:boothId", getProducts);
router.get("details/:productId", getProductDetails);
router.patch("/buy/:productId", buyProduct);
router.post("/create", createProduct)
router.patch("/edit/:productId", editProduct);
router.patch("/status/:productId", changeStatusProduct);
router.get('/vendor', getVendorProducts);

export default router;