import express from "express";
import { getProducts, getProductDetails, buyProduct, createProduct, editProduct, changeStatusProduct} from "../controllers/productControllers.js";

const router = express.Router();

router.get("/booth/:boothId", getProducts);
router.get("details/:productId", getProductDetails);
router.patch("/buy/:productId", buyProduct);
router.post("/create", createProduct)
router.patch("/edit/:productId", editProduct);
router.patch("/status/:productId", changeStatusProduct);

export default router;