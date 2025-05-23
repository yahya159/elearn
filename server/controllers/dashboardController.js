import User from '../models/User.js';
import Course from '../models/Course.js';

export const getDashboard = async (req, res) => {
  try {
    if (req.user.role === 'admin') {
      // Example stats for admin
      const newUsers = await User.countDocuments({ createdAt: { $gte: new Date(Date.now() - 7*24*60*60*1000) } });
      const totalCourses = await Course.countDocuments();
      const revenue = 12345; // Replace with real calculation if needed
      return res.json({ stats: { newUsers, totalCourses, revenue } });
    } else {
      // User dashboard
      const user = await User.findById(req.user._id).select('-password').populate('enrolledCourses');
      return res.json({
        user,
        courses: user.enrolledCourses
      });
    }
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to fetch dashboard data' });
  }
}; 