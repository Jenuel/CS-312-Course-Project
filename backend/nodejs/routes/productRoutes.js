import express from "express";
import { getProducts, getProductDetails, buyProduct, createProduct, editProduct, changeStatusProduct } from "../controllers/productControllers";

const router = express.Router();

router.get("/:boothId", getProducts);
router.get("details/:productId", getProductDetails);
router.patch("/:productId", buyProduct);
router.post("/create", createProduct)
router.patch("/edit/:productId", editProduct);
router.patch("/status/:productId", changeStatusProduct);

export default router;