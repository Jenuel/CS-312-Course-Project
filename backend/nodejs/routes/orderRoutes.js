import express from "express";
import {
  getCompletedOrders,
  createOrder,
  cancelOrder,
  approveOrder,
  addToOrder,
  getReservedOrders,
  checkPendingOrder,
  getCustomerID
} from "../controllers/orderControllers.js";
const router = express.Router();

router.get("/reserved/:boothId", getReservedOrders); // vendor *
router.get("/complete/:boothId", getCompletedOrders); // vendor *
router.post("/create/:boothID", createOrder); // customer *
router.patch("/cancel/:orderId", cancelOrder); // customer *
router.patch("/approve/:orderId", approveOrder); // vendor *
router.post("/addToOrder/:orderId", addToOrder); // customer *
router.get("/checkPendingOrder/:customerId",checkPendingOrder)// customer 
router.get("/getCustomerID/:userId",checkPendingOrder)// customer 

export default router;
