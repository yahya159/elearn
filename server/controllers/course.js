import Course from "../models/course.js";
import User from "../models/user.js";
import { uploadToCloudinary, deleteFromCloudinary } from "../utils/cloudinary.js";

// Get all courses
export const getAllCourses = async (req, res) => {
    try {
        const { category, level, search } = req.query;
        const query = { isPublished: true };

        if (category) query.category = category;
        if (level) query.level = level;
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        const courses = await Course.find(query)
            .select('-lectures')
            .populate('createdBy', 'name email')
            .sort({ createdAt: -1 });
            
        res.status(200).json({
            success: true,
            message: 'All courses fetched successfully',
            courses
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get single course
export const getSingleCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const course = await Course.findById(id)
            .populate('createdBy', 'name email')
            .populate('reviews.user', 'name');
        
        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Course fetched successfully',
            course
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get course lectures
export const fetchLectures = async (req, res) => {
    try {
        const { id } = req.params;
        const course = await Course.findById(id)
            .populate('lectures.lecture');
        
        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course not found'
            });
        }

        // Check if user is enrolled or is the instructor
        const isEnrolled = course.enrolledStudents.includes(req.user._id);
        const isInstructor = course.createdBy.toString() === req.user._id.toString();

        if (!isEnrolled && !isInstructor) {
            return res.status(403).json({
                success: false,
                message: 'You must be enrolled to view lectures'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Course lectures fetched successfully',
            lectures: course.lectures
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Create course
export const createCourse = async (req, res) => {
    try {
        const { title, description, category, level, price } = req.body;
        const thumbnail = req.file;

        if (!thumbnail) {
            return res.status(400).json({
                success: false,
                message: 'Course thumbnail is required'
            });
        }

        const thumbnailResult = await uploadToCloudinary(thumbnail.path, 'courses');

        const course = await Course.create({
            title,
            description,
            category,
            level,
            price,
            thumbnail: {
                public_id: thumbnailResult.public_id,
                secure_url: thumbnailResult.secure_url
            },
            createdBy: req.user._id
        });

        res.status(201).json({
            success: true,
            message: 'Course created successfully',
            course
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Update course
export const updateCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, category, level, price } = req.body;
        const thumbnail = req.file;

        const course = await Course.findById(id);
        
        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course not found'
            });
        }

        if (course.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'You are not authorized to update this course'
            });
        }

        if (thumbnail) {
            // Delete old thumbnail
            if (course.thumbnail?.public_id) {
                await deleteFromCloudinary(course.thumbnail.public_id);
            }
            
            const thumbnailResult = await uploadToCloudinary(thumbnail.path, 'courses');
            course.thumbnail = {
                public_id: thumbnailResult.public_id,
                secure_url: thumbnailResult.secure_url
            };
        }

        course.title = title || course.title;
        course.description = description || course.description;
        course.category = category || course.category;
        course.level = level || course.level;
        course.price = price || course.price;

        await course.save();

        res.status(200).json({
            success: true,
            message: 'Course updated successfully',
            course
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Delete course
export const deleteCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const course = await Course.findById(id);
        
        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course not found'
            });
        }

        if (course.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'You are not authorized to delete this course'
            });
        }

        // Delete thumbnail
        if (course.thumbnail?.public_id) {
            await deleteFromCloudinary(course.thumbnail.public_id);
        }

        // Delete lecture files
        for (const lecture of course.lectures) {
            if (lecture.lecture?.public_id) {
                await deleteFromCloudinary(lecture.lecture.public_id);
            }
        }

        await course.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Course deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Add lecture
export const addLecture = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, order } = req.body;
        const lecture = req.file;

        if (!lecture) {
            return res.status(400).json({
                success: false,
                message: 'Lecture file is required'
            });
        }

        const course = await Course.findById(id);
        
        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course not found'
            });
        }

        if (course.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'You are not authorized to add lectures to this course'
            });
        }

        const lectureResult = await uploadToCloudinary(lecture.path, 'lectures');

        course.lectures.push({
            title,
            description,
            order: order || course.lectures.length,
            lecture: {
                public_id: lectureResult.public_id,
                secure_url: lectureResult.secure_url
            }
        });

        course.numberOfLectures = course.lectures.length;
        await course.save();

        res.status(201).json({
            success: true,
            message: 'Lecture added successfully',
            course
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Update lecture
export const updateLecture = async (req, res) => {
    try {
        const { id, lectureId } = req.params;
        const { title, description, order } = req.body;
        const lecture = req.file;

        const course = await Course.findById(id);
        
        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course not found'
            });
        }

        if (course.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'You are not authorized to update lectures in this course'
            });
        }

        const lectureIndex = course.lectures.findIndex(
            lecture => lecture._id.toString() === lectureId
        );

        if (lectureIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Lecture not found'
            });
        }

        if (lecture) {
            // Delete old lecture file
            if (course.lectures[lectureIndex].lecture?.public_id) {
                await deleteFromCloudinary(course.lectures[lectureIndex].lecture.public_id);
            }

            const lectureResult = await uploadToCloudinary(lecture.path, 'lectures');
            course.lectures[lectureIndex].lecture = {
                public_id: lectureResult.public_id,
                secure_url: lectureResult.secure_url
            };
        }

        course.lectures[lectureIndex].title = title || course.lectures[lectureIndex].title;
        course.lectures[lectureIndex].description = description || course.lectures[lectureIndex].description;
        if (order !== undefined) {
            course.lectures[lectureIndex].order = order;
        }

        await course.save();

        res.status(200).json({
            success: true,
            message: 'Lecture updated successfully',
            course
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Delete lecture
export const deleteLecture = async (req, res) => {
    try {
        const { id, lectureId } = req.params;

        const course = await Course.findById(id);
        
        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course not found'
            });
        }

        if (course.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'You are not authorized to delete lectures from this course'
            });
        }

        const lectureIndex = course.lectures.findIndex(
            lecture => lecture._id.toString() === lectureId
        );

        if (lectureIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Lecture not found'
            });
        }

        // Delete lecture file
        if (course.lectures[lectureIndex].lecture?.public_id) {
            await deleteFromCloudinary(course.lectures[lectureIndex].lecture.public_id);
        }

        course.lectures.splice(lectureIndex, 1);
        course.numberOfLectures = course.lectures.length;
        await course.save();

        res.status(200).json({
            success: true,
            message: 'Lecture deleted successfully',
            course
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
