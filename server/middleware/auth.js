import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Authentication middleware
export const isAuth = async (req, res, next) => {
    try {
        // Vérifier le token dans les cookies ou l'en-tête Authorization
        const token = req.cookies.token || req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized to access this route'
            });
        }

        // Vérifier le token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Récupérer l'utilisateur
        const user = await User.findById(decoded.id).select('-password');
        
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User not found'
            });
        }

        // Vérifier si le token n'est pas expiré
        if (decoded.exp < Date.now() / 1000) {
            return res.status(401).json({
                success: false,
                message: 'Token expiré'
            });
        }

        req.user = user;
        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Token invalide'
            });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token expiré'
            });
        }
        return res.status(500).json({
            success: false,
            message: 'Erreur d\'authentification'
        });
    }
};

// Admin authorization middleware
export const isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({
            success: false,
            message: 'Only admins can perform this action'
        });
    }
    next();
};

// Instructor authorization middleware
export const isInstructor = (req, res, next) => {
    if (req.user.role !== 'instructor' && req.user.role !== 'admin') {
        return res.status(403).json({
            success: false,
            message: 'Only instructors can perform this action'
        });
    }
    next();
};

// Course access middleware
export const hasCourseAccess = async (req, res, next) => {
    try {
        const courseId = req.params.id;
        
        // Check if user is admin or instructor
        if (req.user.role === 'admin' || req.user.role === 'instructor') {
            return next();
        }

        // Check if user has subscribed to the course
        const hasAccess = req.user.subscription.includes(courseId);
        
        if (!hasAccess) {
            return res.status(403).json({
                success: false,
                message: 'You need to subscribe to access this course'
            });
        }

        next();
    } catch (error) {
        return res.status(403).json({
            success: false,
            message: 'Access verification failed'
        });
    }
}; 