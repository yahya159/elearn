import { generateChatResponse } from '../utils/ai/chatbot.js';
import { detectErrors } from '../utils/ai/errorDetector.js';
import { detectFraud } from '../utils/ai/fraudDetector.js';

// Chatbot endpoint
export const chatWithAI = async (req, res) => {
    try {
        const { message, context } = req.body;
        
        if (!message) {
            return res.status(400).json({
                success: false,
                message: 'Message is required'
            });
        }

        const response = await generateChatResponse(message, context);
        
        res.status(200).json({
            success: true,
            response
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Error detection endpoint
export const checkForErrors = async (req, res) => {
    try {
        const { text } = req.body;
        
        if (!text) {
            return res.status(400).json({
                success: false,
                message: 'Text is required'
            });
        }

        const result = await detectErrors(text);
        
        res.status(200).json({
            success: true,
            result
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Fraud detection endpoint
export const checkForFraud = async (req, res) => {
    try {
        const { userId, activity } = req.body;
        
        if (!userId || !activity) {
            return res.status(400).json({
                success: false,
                message: 'User ID and activity data are required'
            });
        }

        const result = await detectFraud(userId, activity);
        
        res.status(200).json({
            success: true,
            result
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}; 