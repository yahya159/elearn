import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import LoginForm from '../components/auth/LoginForm';

const LoginPage = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      if (user?.role === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    }
  }, [isAuthenticated, user, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <LoginForm />
      <div className="text-center mt-4">
        <p>Don't have an account? <Link to="/register">Register</Link></p>
        <p className="mt-2 text-sm text-gray-600">For admin access, please use admin credentials to log in.</p>
      </div>
    </div>
  );
};

export default LoginPage; 