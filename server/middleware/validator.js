import { body, validationResult } from 'express-validator';

// Validation middleware
export const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ 
            success: false,
            errors: errors.array().map(err => ({
                field: err.param,
                message: err.msg
            }))
        });
    }
    next();
};

// User registration validation
export const registerValidation = [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long')
        .matches(/\d/)
        .withMessage('Password must contain a number'),
    validate
];

// Login validation
export const loginValidation = [
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('password').notEmpty().withMessage('Password is required'),
    validate
];

// Course validation
export const courseValidation = [
    body('title')
        .trim()
        .notEmpty().withMessage('Title is required')
        .isLength({ min: 3, max: 100 }).withMessage('Title must be between 3 and 100 characters'),
    body('description')
        .trim()
        .notEmpty().withMessage('Description is required')
        .isLength({ min: 10, max: 1000 }).withMessage('Description must be between 10 and 1000 characters'),
    body('category')
        .trim()
        .notEmpty().withMessage('Category is required')
        .isIn(['programming', 'design', 'business', 'marketing', 'music', 'other'])
        .withMessage('Invalid category'),
    body('level')
        .trim()
        .notEmpty().withMessage('Level is required')
        .isIn(['beginner', 'intermediate', 'advanced'])
        .withMessage('Invalid level'),
    body('price')
        .isNumeric().withMessage('Price must be a number')
        .isFloat({ min: 0 }).withMessage('Price cannot be negative'),
    validate
];

// Lecture validation
export const lectureValidation = [
    body('title')
        .trim()
        .notEmpty().withMessage('Title is required')
        .isLength({ min: 3, max: 100 }).withMessage('Title must be between 3 and 100 characters'),
    body('description')
        .trim()
        .notEmpty().withMessage('Description is required')
        .isLength({ min: 10, max: 500 }).withMessage('Description must be between 10 and 500 characters'),
    body('order')
        .isInt({ min: 0 }).withMessage('Order must be a non-negative integer'),
    validate
];

// Review validation
export const reviewValidation = [
    body('rating')
        .isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    body('comment')
        .trim()
        .notEmpty().withMessage('Comment is required')
        .isLength({ min: 10, max: 500 }).withMessage('Comment must be between 10 and 500 characters'),
    validate
];

// AI chat validation
export const chatValidation = [
    body('message').trim().notEmpty().withMessage('Message is required'),
    validate
];

// Validation des données utilisateur
export const validateUser = [
    body('email')
        .isEmail()
        .withMessage('Email invalide')
        .normalizeEmail(),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Le mot de passe doit contenir au moins 6 caractères')
        .matches(/\d/)
        .withMessage('Le mot de passe doit contenir au moins un chiffre'),
    body('name')
        .trim()
        .isLength({ min: 2 })
        .withMessage('Le nom doit contenir au moins 2 caractères'),
    validate
]; 