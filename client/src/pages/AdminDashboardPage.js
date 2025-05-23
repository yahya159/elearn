import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

const AdminDashboardPage = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCourses: 0,
    totalRevenue: 0,
    recentActivity: [],
    userGrowth: 0,
    courseGrowth: 0,
    revenueGrowth: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get('/admin/stats');
      setStats(response.data.stats);
      setLoading(false);
    } catch (error) {
      setError(
        error.response?.data?.message ||
        error.message ||
        'Failed to fetch dashboard statistics'
      );
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-50 pt-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow p-6">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-8 bg-gray-200 rounded w-1/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gray-50 pt-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error}</p>
          <button 
            onClick={fetchStats}
            className="mt-2 text-sm text-red-600 hover:text-red-800"
          >
            Try again
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900">Total Users</h3>
            <p className="text-3xl font-bold text-indigo-600">{stats.totalUsers}</p>
            <p className="text-sm text-gray-500 mt-2">
              {stats.userGrowth > 0 ? '+' : ''}{stats.userGrowth}% from last month
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900">Total Courses</h3>
            <p className="text-3xl font-bold text-green-600">{stats.totalCourses}</p>
            <p className="text-sm text-gray-500 mt-2">
              {stats.courseGrowth > 0 ? '+' : ''}{stats.courseGrowth}% from last month
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900">Total Revenue</h3>
            <p className="text-3xl font-bold text-purple-600">${stats.totalRevenue}</p>
            <p className="text-sm text-gray-500 mt-2">
              {stats.revenueGrowth > 0 ? '+' : ''}{stats.revenueGrowth}% from last month
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link 
            to="/admin/users" 
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow group"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Manage Users</h3>
              <span className="text-indigo-600 group-hover:text-indigo-800">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </div>
            <p className="text-gray-600">View, edit, and manage user accounts</p>
          </Link>
          <Link 
            to="/admin/courses" 
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow group"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Manage Courses</h3>
              <span className="text-indigo-600 group-hover:text-indigo-800">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </div>
            <p className="text-gray-600">Review and manage course content</p>
          </Link>
          <Link 
            to="/admin/stats" 
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow group"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">View Analytics</h3>
              <span className="text-indigo-600 group-hover:text-indigo-800">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </div>
            <p className="text-gray-600">Detailed platform statistics and reports</p>
          </Link>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
          </div>
          <div className="p-6">
            {stats.recentActivity && stats.recentActivity.length > 0 ? (
              <ul className="space-y-4">
                {stats.recentActivity.map((activity, index) => (
                  <li key={index} className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <span className={`inline-flex items-center justify-center h-8 w-8 rounded-full ${
                        activity.type === 'enrollment' ? 'bg-green-100' :
                        activity.type === 'course' ? 'bg-blue-100' :
                        activity.type === 'user' ? 'bg-purple-100' :
                        'bg-indigo-100'
                      }`}>
                        <span className={`text-sm font-medium leading-none ${
                          activity.type === 'enrollment' ? 'text-green-600' :
                          activity.type === 'course' ? 'text-blue-600' :
                          activity.type === 'user' ? 'text-purple-600' :
                          'text-indigo-600'
                        }`}>
                          {activity.type[0].toUpperCase()}
                        </span>
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {activity.description}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(activity.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-center py-4">No recent activity</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage; 