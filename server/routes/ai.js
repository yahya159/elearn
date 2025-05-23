import express from 'express';
import { chatWithAI, checkForErrors, checkForFraud } from '../controllers/ai.js';
import { isAuth } from '../middleware/auth.js';

const router = express.Router();

// AI Chatbot route
router.post('/chat', isAuth, chatWithAI);

// Error detection route
router.post('/check-errors', isAuth, checkForErrors);

// Fraud detection route
router.post('/check-fraud', isAuth, checkForFraud);

export default router; 