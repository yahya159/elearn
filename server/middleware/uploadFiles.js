import multer from "multer";
import path from "path";
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs/promises';

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Ensure uploads directory exists
const ensureUploadsDir = async () => {
    try {
        await fs.access('uploads');
    } catch {
        await fs.mkdir('uploads');
    }
};

// Configure storage
const storage = multer.diskStorage({
    destination: async (req, file, cb) => {
        await ensureUploadsDir();
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// File filter for images
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
    
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Type de fichier non supporté. Types acceptés: JPEG, PNG, GIF, PDF'), false);
    }
};

// File filter for videos
const videoFilter = (req, file, cb) => {
    const allowedTypes = ['video/mp4', 'video/webm', 'video/ogg'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only MP4, WEBM & OGG are allowed.'), false);
    }
};

// Configure upload middleware for images
export const upload = multer({
    storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB max
    }
});

// Configure upload middleware for videos
export const uploadVideo = multer({
    storage,
    fileFilter: videoFilter,
    limits: {
        fileSize: 100 * 1024 * 1024 // 100MB limit
    }
});

// Upload to Cloudinary
export const uploadToCloudinary = async (file, folder = 'general') => {
    try {
        const result = await cloudinary.uploader.upload(file.path, {
            folder,
            resource_type: 'auto'
        });
        
        // Delete local file after upload
        await fs.unlink(file.path);
        
        return result;
    } catch (error) {
        // Clean up local file if upload fails
        try {
            await fs.unlink(file.path);
        } catch (unlinkError) {
            console.error('Error deleting local file:', unlinkError);
        }
        throw error;
    }
};

// Error handling middleware
export const handleUploadError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                success: false,
                message: 'Fichier trop volumineux. Taille maximale: 5MB pour les images, 100MB pour les vidéos'
            });
        }
        return res.status(400).json({
            success: false,
            message: err.message
        });
    }
    
    if (err.message.includes('Type de fichier non supporté')) {
        return res.status(400).json({
            success: false,
            message: err.message
        });
    }
    
    next(err);
}; 