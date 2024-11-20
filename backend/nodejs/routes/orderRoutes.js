import express from "express";
import { getPendingOrders, getCompletedOrders, createOrder, cancelOrder, approveOrder} from "../controllers/orderControllers.js";
const router = express.Router();

router.get("/pending", getPendingOrders);
router.get("/complete/:boothId", getCompletedOrders);
router.post("/create", createOrder);
router.patch("/cancel/:orderId", cancelOrder);
router.patch("/approve/:id", approveOrder);

export default router;