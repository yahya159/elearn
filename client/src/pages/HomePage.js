import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const HomePage = () => {
  const [randomCourse, setRandomCourse] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:8000/api/courses/all')
      .then(res => {
        const courses = res.data.courses || [];
        if (courses.length > 0) {
          const course = courses[Math.floor(Math.random() * courses.length)];
          setRandomCourse(course);
        }
      })
      .catch(() => setRandomCourse(null));
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-purple-100 to-white">
      <h1 className="text-4xl font-bold mb-4">Welcome to E-Learning!</h1>
      <p className="mb-8 text-lg text-gray-700">Advance your skills with our curated courses.</p>
      <div className="space-x-4 mb-8">
        <Link to="/courses" className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">Browse Courses</Link>
        <Link to="/login" className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Login</Link>
        <Link to="/register" className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">Register</Link>
      </div>
      {randomCourse && (
        <div className="bg-white rounded shadow p-6 flex flex-col items-center max-w-md w-full">
          <h2 className="text-2xl font-bold mb-2">Featured Course</h2>
          {randomCourse.thumbnail?.secure_url && (
            <img
              src={randomCourse.thumbnail.secure_url}
              alt={randomCourse.title}
              className="w-full h-48 object-cover rounded mb-4"
            />
          )}
          <h3 className="text-xl font-semibold mb-2">{randomCourse.title}</h3>
          <p className="text-gray-600 mb-4">{randomCourse.description?.slice(0, 100) || 'No description.'}</p>
          <Link to={`/courses/${randomCourse._id}`} className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">View Course</Link>
        </div>
      )}
    </div>
  );
};

export default HomePage; 