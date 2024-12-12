import express from "express";
import {
  getCompletedOrders,
  createOrder,
  cancelOrder,
  approveOrder,
  addToOrder,
  getReservedOrders,
} from "../controllers/orderControllers.js";
const router = express.Router();

router.get("/reserved/:boothId", getReservedOrders); // vendor *
router.get("/complete/:boothId", getCompletedOrders); // vendor *
router.post("/create/:boothID", createOrder); // customer *
router.patch("/cancel/:orderId", cancelOrder); // customer *
router.patch("/approve/:orderId", approveOrder); // vendor *
router.post("/addToOrder/:orderId", addToOrder); // customer 

export default router;
