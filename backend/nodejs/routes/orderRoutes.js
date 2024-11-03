import express from "express";
import { getPendingOrders, getCompletedOrders, createOrder, cancelOrder, approveOrder } from "../controllers/orderControllers";
const router = express.Router();

router.get("/:boothId", getPendingOrders);
router.get("/:boothId", getCompletedOrders);
router.post("/create", createOrder);
router.post("/cancel", cancelOrder);
router.patch("/approve", approveOrder);

export default router;