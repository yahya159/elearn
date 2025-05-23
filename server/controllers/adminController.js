import User from '../models/User.js';
import Course from '../models/course.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// --- Course & Lecture Management ---

// Create Course
export const createCourse = async (req, res) => {
  try {
    const { title, description, price, category, level } = req.body;
    const imagePath = req.file?.path || '';

    const course = new Course({
      title,
      description,
      price: price || 0,
      category,
      level,
      image: imagePath,
      instructor: req.user._id // Assuming req.user is set by auth middleware
    });

    await course.save();
    res.status(201).json({ 
      success: true, 
      course: {
        ...course.toObject(),
        instructor: req.user.name
      }
    });
  } catch (error) {
    // Clean up uploaded file if course creation fails
    if (req.file?.path) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Error deleting file:', err);
      });
    }
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Error creating course'
    });
  }
};

// Add Lecture
export const addLecture = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { title, description } = req.body;
    const videoPath = req.file?.path || '';

    const course = await Course.findById(courseId);
    if (!course) {
      // Clean up uploaded file if course not found
      if (req.file?.path) {
        fs.unlink(req.file.path, (err) => {
          if (err) console.error('Error deleting file:', err);
        });
      }
      return res.status(404).json({ 
        success: false,
        message: 'Course not found' 
      });
    }

    // Check if user is the instructor
    if (course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to add lectures to this course'
      });
    }

    const lecture = {
      title,
      description,
      video: videoPath
    };

    course.addLecture(lecture);
    await course.save();

    res.status(200).json({ 
      success: true, 
      course: {
        ...course.toObject(),
        instructor: req.user.name
      }
    });
  } catch (error) {
    // Clean up uploaded file if lecture addition fails
    if (req.file?.path) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Error deleting file:', err);
      });
    }
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Error adding lecture'
    });
  }
};

// Delete Lecture
export const deleteLecture = async (req, res) => {
  try {
    const { courseId, lectureId } = req.params;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ 
        success: false,
        message: 'Course not found' 
      });
    }

    // Check if user is the instructor
    if (course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete lectures from this course'
      });
    }

    // Find the lecture to get its video path
    const lecture = course.lectures.find(l => l._id.toString() === lectureId);
    if (!lecture) {
      return res.status(404).json({
        success: false,
        message: 'Lecture not found'
      });
    }

    // Delete the video file
    if (lecture.video) {
      fs.unlink(lecture.video, (err) => {
        if (err) console.error('Error deleting video file:', err);
      });
    }

    course.removeLecture(lectureId);
    await course.save();

    res.status(200).json({ 
      success: true, 
      message: 'Lecture deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Error deleting lecture'
    });
  }
};

// --- User Management & Stats ---

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
export const getUsers = async (req, res) => {
  try {
    const users = await User.find({})
      .select('-password')
      .sort({ createdAt: -1 });
    res.json({
      success: true,
      users
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message || 'Error fetching users'
    });
  }
};

// @desc    Get user by ID
// @route   GET /api/admin/users/:id
// @access  Private/Admin
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('courses', 'title')
      .populate('enrolledCourses', 'title');

    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }

    res.json({
      success: true,
      user
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message || 'Error fetching user'
    });
  }
};

// @desc    Update user
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
export const updateUser = async (req, res) => {
  try {
    const { name, email, role } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }

    // Check if email is already taken by another user
    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(400).json({
          success: false,
          message: 'Email already in use'
        });
      }
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.role = role || user.role;

    const updatedUser = await user.save();
    
    res.json({
      success: true,
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message || 'Error updating user'
    });
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }

    // Prevent deleting the last admin
    if (user.role === 'admin') {
      const adminCount = await User.countDocuments({ role: 'admin' });
      if (adminCount <= 1) {
        return res.status(400).json({
          success: false,
          message: 'Cannot delete the last admin user'
        });
      }
    }

    await user.deleteOne();
    res.json({ 
      success: true,
      message: 'User deleted successfully' 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message || 'Error deleting user'
    });
  }
};

// @desc    Get admin stats
// @route   GET /api/admin/stats
// @access  Private/Admin
export const getStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalCourses,
      totalInstructors,
      totalStudents,
      totalEnrollments
    ] = await Promise.all([
      User.countDocuments(),
      Course.countDocuments(),
      User.countDocuments({ role: 'instructor' }),
      User.countDocuments({ role: 'user' }),
      Course.aggregate([
        { $unwind: '$enrolledStudents' },
        { $count: 'total' }
      ]).then(result => result[0]?.total || 0)
    ]);
    
    res.json({
      success: true,
      stats: {
        totalUsers,
        totalCourses,
        totalInstructors,
        totalStudents,
        totalEnrollments
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message || 'Error fetching stats'
    });
  }
}; 