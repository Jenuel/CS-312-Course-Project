import express from "express";
import {
  getPendingOrders,
  getCompletedOrders,
  createOrder,
  cancelOrder,
  approveOrder,
  addToOrder,
} from "../controllers/orderControllers.js";
const router = express.Router();

router.get("/pending/:boothId", getPendingOrders); // vendor *
router.get("/complete/:boothId", getCompletedOrders); // vendor *
router.post("/create/:boothId", createOrder); // customer *
router.patch("/cancel/:orderId", cancelOrder); // customer *
router.patch("/approve/:orderId", approveOrder); // vendor *
router.post("/addToOrder/:orderId", addToOrder); // customer 

export default router;
