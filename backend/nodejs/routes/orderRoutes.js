import express from "express";
import { getPendingOrders, getCompletedOrders, createOrder, cancelOrder, approveOrder, approveCancellation } from "../controllers/orderControllers";
const router = express.Router();

router.get("/:boothId", getPendingOrders);
router.get("/:boothId", getCompletedOrders);
router.post("/create", createOrder);
router.patch("/cancel/:orderId", cancelOrder);
router.patch("/approve", approveOrder);
router.delete("/cancel/:orderId");

export default router;