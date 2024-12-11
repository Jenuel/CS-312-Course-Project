import express from 'express';
import { analyticsController } from '../controllers/analyticsController.js';

const router = express.Router();
router.get('/dashboard/:boothId', analyticsController.getDashboardMetrics);
router.get('/sales/:boothId', analyticsController.getSalesTrends);
router.get('/products/:boothId', analyticsController.getProductPerformance);
router.get('/inventory/:boothId', analyticsController.getInventoryStatus);

export default router;




