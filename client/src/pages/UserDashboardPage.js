import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { getDashboard } from '../redux/slices/dashboardSlice';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const UserDashboardPage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const { data } = useSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(getDashboard()).unwrap().catch(() => {});
  }, [dispatch]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get('http://localhost:8000/api/user/me', {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      withCredentials: true
    })
      .then(res => {
        setUser(res.data.user);
        setLoading(false);
      })
      .catch((err) => {
        setError(
          err.response?.data?.message ||
          err.message ||
          'Failed to fetch dashboard data. Please try again later.'
        );
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (error)   return <p className="text-red-500">{error}</p>;
  if (!user) return null;

  const enrolledCourses = user.enrolledCourses || [];
  const certificates = user.certificates || [];

  // Example chart data from dashboard or fallback
  const courseProgress = data?.courseProgress || [
    { title: 'React Basics', progress: 80 },
    { title: 'Node.js', progress: 60 },
    { title: 'MongoDB', progress: 40 }
  ];

  const chartData = {
    labels: courseProgress.map(c => c.title),
    datasets: [
      {
        label: 'Progress (%)',
        data: courseProgress.map(c => c.progress),
        backgroundColor: 'rgba(99, 102, 241, 0.7)',
        borderRadius: 6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: 'Course Progress' },
    },
    scales: {
      y: { beginAtZero: true, max: 100 }
    }
  };

  if (!data) return null;

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <h1 className="text-3xl font-bold mb-4">Welcome, {user.name}!</h1>
      <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded shadow text-center">
          <div className="text-2xl font-bold text-indigo-600">{enrolledCourses.length}</div>
          <div className="text-gray-600">Courses Enrolled</div>
        </div>
        <div className="bg-white p-6 rounded shadow text-center">
          <div className="text-2xl font-bold text-green-600">{certificates.length}</div>
          <div className="text-gray-600">Certificates</div>
        </div>
        <div className="bg-white p-6 rounded shadow text-center">
          <div className="text-2xl font-bold text-purple-600">{user.email}</div>
          <div className="text-gray-600">Email</div>
        </div>
      </div>
      <div className="bg-white p-6 rounded shadow mb-8">
        <h2 className="text-xl font-bold mb-4">Enrolled Courses</h2>
        {enrolledCourses.length === 0 ? (
          <div>No enrolled courses yet.</div>
        ) : (
          <ul className="space-y-2">
            {enrolledCourses.map(course => (
              <li key={course._id} className="border-b pb-2">
                <span className="font-medium">{course.title || course.name || 'Untitled Course'}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="bg-white p-6 rounded shadow mb-8">
        <h2 className="text-xl font-bold mb-4">Course Progress</h2>
        <Bar data={chartData} options={chartOptions} />
      </div>
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
        <div>Recent activity coming soon.</div>
      </div>
    </div>
  );
};

export default UserDashboardPage; 