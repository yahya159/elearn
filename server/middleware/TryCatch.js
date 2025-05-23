const TryCatch = (handler) => {
    return async(req, res, next) => {
        try {
            await handler(req, res, next);
        } catch (error) {
            // Log the error
            console.error('Error:', error);
            
            // Determine appropriate status code
            const statusCode = error.statusCode || 500;
            
            // Send structured error response
            res.status(statusCode).json({
                success: false,
                message: error.message || 'An error occurred',
                ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
            });
        }
    };
};

export default TryCatch; 