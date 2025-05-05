import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import LoginForm from '../components/auth/LoginForm';
import useAuth from '../hooks/useAuth';
import Card from '../components/common/Card';

function LoginPage() {
  const { currentUser, loading, login } = useAuth();
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState(null);

  useEffect(() => {
    // Redirect if user is already logged in
    if (currentUser && !loading) {
      navigate('/');
    }
  }, [currentUser, loading, navigate]);

  const handleLogin = async (credentials) => {
    setLoginError(null);
    const success = await login(credentials.email, credentials.password);
    if (success) {
      navigate('/');
    } else {
      setLoginError('Invalid email or password');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Login to your account</h2>
        </div>

        <LoginForm onSubmit={handleLogin} error={loginError} />

        <div className="text-center">
          <p className="mt-2 text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
              Create one here
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
}

export default LoginPage;