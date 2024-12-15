import express from "express";
import {
  getPendingOrders,
  getCompletedOrders,
  createOrder,
  addToOrder,
  cancelOrder,
  completeOrder,
  checkReservedOrder,
  removeItemFromOrder,
  alterOrder,
} from "../controllers/orderControllers.js";
const router = express.Router();

router.get("/pending/:boothId", getPendingOrders); // vendor *
router.get("/complete/:boothId", getCompletedOrders); // vendor *
router.post("/create/:boothID", createOrder); // customer *
router.post("/addToOrder/:orderId", addToOrder); // customer *
router.patch("/cancel/:orderId", cancelOrder); // customer *
router.patch("/complete/:orderId", completeOrder); // vendor *
router.get("/checkReservedOrder/:customerId", checkReservedOrder); // customer old checkPendingOrder
router.delete("/removeItem/:orderId", removeItemFromOrder); // client
router.patch("/alterOrder/:orderId", alterOrder); // customer

// OLD ROUTING
// router.get("/pending/:boothId", getPendingOrders); // vendor *
// router.get("/complete/:boothId", getCompletedOrders); // vendor *
// router.post("/create/:boothID", createOrder); // customer *
// router.patch("/cancel/:orderId", cancelOrder); // customer *
// router.patch("/approve/:orderId", approveOrder); // vendor *
// router.post("/addToOrder/:orderId", addToOrder); // customer *
// router.get("/checkPendingOrder/:customerId", checkPendingOrder)// customer
// router.get("/getCustomerID/:userId", checkPendingOrder)// customer

// router.delete("/removeCompleted/:orderId", removeCompletedOrder); // vendor *
// router.patch("/products/buy/:orderId", completeOrder);
// router.patch("/complete/:orderId", completeOrder);
// router.delete("/removeItem/:orderId", removeItemFromOrder); // client

export default router;
