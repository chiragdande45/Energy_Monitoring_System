import express from 'express';
import {
  storeSensorData,
  getLiveData,
  getHistory,
  getMonthlyCost,
  getPeakUsage,
  generateReport,
  getSettings,
  updateSettings
} from '../controllers/energyController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/sensor-data', storeSensorData);
router.get('/live-data', authenticateToken, getLiveData);
router.get('/history', authenticateToken, getHistory);
router.get('/monthly-cost', authenticateToken, getMonthlyCost);
router.get('/peak-usage', authenticateToken, getPeakUsage);
router.get('/report', authenticateToken, generateReport);
router.get('/settings', authenticateToken, getSettings);
router.put('/settings', authenticateToken, updateSettings);

export default router;
