import express from "express";
import {
  getPendingOrders,
  getCompletedOrders,
  createOrder,
  cancelOrder,
  approveOrder,
} from "../controllers/orderControllers.js";
const router = express.Router();

router.get("/pending/:boothId", getPendingOrders); // vendor
router.get("/complete/:boothId", getCompletedOrders); // vendor
router.post("/create", createOrder); // customer
router.patch("/cancel/:orderId", cancelOrder); // customer
router.patch("/approve/:orderId", approveOrder); // vendor

export default router;
