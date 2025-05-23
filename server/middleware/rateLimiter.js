import rateLimit from 'express-rate-limit';

// Helper function to create rate limiters with consistent error format
const createLimiter = (options) => {
    return rateLimit({
        ...options,
        handler: (req, res) => {
            res.status(429).json({
                success: false,
                message: options.message,
                retryAfter: Math.ceil(options.windowMs / 1000) // Convert to seconds
            });
        },
        standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
        legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    });
};

// Authentication limiter (login, password reset)
export const authLimiter = createLimiter({
    windowMs: 15 * 1000, // 15 seconds
    max: 5, // 5 attempts
    message: 'Too many login attempts, please try again after 15 seconds'
});

// API general limiter
export const apiLimiter = createLimiter({
    windowMs: 60 * 1000, // 1 minute
    max: 100, // 100 requests per minute
    message: 'Too many requests, please try again later'
});

// Registration limiter
export const registerLimiter = createLimiter({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3, // 3 accounts per hour
    message: 'Too many accounts created, please try again after an hour'
});

// AI routes limiter
export const aiLimiter = createLimiter({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 20, // 20 requests per hour
    message: 'Too many AI requests, please try again after an hour'
});

// Course creation limiter (for instructors)
export const courseCreationLimiter = createLimiter({
    windowMs: 24 * 60 * 60 * 1000, // 24 hours
    max: 5, // 5 courses per day
    message: 'Too many courses created, please try again tomorrow'
});

// Lecture upload limiter
export const lectureUploadLimiter = createLimiter({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10, // 10 lectures per hour
    message: 'Too many lectures uploaded, please try again after an hour'
});

// Review submission limiter
export const reviewLimiter = createLimiter({
    windowMs: 24 * 60 * 60 * 1000, // 24 hours
    max: 10, // 10 reviews per day
    message: 'Too many reviews submitted, please try again tomorrow'
}); 