import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const AdminStatsPage = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCourses: 0,
    totalRevenue: 0,
    monthlyRevenue: [],
    userGrowth: [],
    courseCategories: [],
    topCourses: [],
    recentEnrollments: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('month');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/admin/stats?timeRange=${timeRange}`);
        setStats(response.data.stats);
        setLoading(false);
      } catch (error) {
        setError(
          error.response?.data?.message ||
          error.message ||
          'Failed to fetch statistics'
        );
        setLoading(false);
      }
    };
    fetchStats();
  }, [timeRange]);

  if (loading) return <div className="min-h-screen pt-20 px-4">Loading...</div>;
  if (error) return <div className="min-h-screen pt-20 px-4 text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 pt-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Platform Analytics</h1>
          <div className="flex items-center space-x-4">
            <select
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="year">Last Year</option>
            </select>
            <Link to="/admin" className="btn-secondary">
              Back to Dashboard
            </Link>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900">Total Users</h3>
            <p className="text-3xl font-bold text-indigo-600">{stats.totalUsers}</p>
            <p className="text-sm text-gray-500 mt-2">
              {stats.userGrowth[stats.userGrowth.length - 1] > 0 ? '+' : ''}
              {stats.userGrowth[stats.userGrowth.length - 1]}% from last period
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900">Total Courses</h3>
            <p className="text-3xl font-bold text-green-600">{stats.totalCourses}</p>
            <p className="text-sm text-gray-500 mt-2">
              Across {stats.courseCategories.length} categories
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900">Total Revenue</h3>
            <p className="text-3xl font-bold text-purple-600">${stats.totalRevenue}</p>
            <p className="text-sm text-gray-500 mt-2">
              {stats.monthlyRevenue[stats.monthlyRevenue.length - 1] > 0 ? '+' : ''}
              {stats.monthlyRevenue[stats.monthlyRevenue.length - 1]}% from last period
            </p>
          </div>
        </div>

        {/* Top Courses */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Top Performing Courses</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {stats.topCourses.map((course, index) => (
                <div key={course._id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <span className="text-lg font-medium text-gray-500">#{index + 1}</span>
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">{course.title}</h3>
                      <p className="text-sm text-gray-500">{course.instructor}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">${course.revenue}</p>
                    <p className="text-sm text-gray-500">{course.enrollments} enrollments</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Enrollments */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Recent Enrollments</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {stats.recentEnrollments.map((enrollment, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                      <span className="text-indigo-600 font-medium">
                        {enrollment.student.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">{enrollment.student.name}</h3>
                      <p className="text-sm text-gray-500">{enrollment.course.title}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">${enrollment.amount}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(enrollment.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminStatsPage; 