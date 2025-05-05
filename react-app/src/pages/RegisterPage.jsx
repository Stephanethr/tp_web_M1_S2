import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import RegisterForm from '../components/auth/RegisterForm';
import useAuth from '../hooks/useAuth';
import Card from '../components/common/Card';
import Loading from '../components/common/Loading';

function RegisterPage() {
  const { currentUser, loading, error, register } = useAuth();
  const navigate = useNavigate();
  const [registerError, setRegisterError] = useState(null);

  useEffect(() => {
    // Redirect if user is already logged in
    if (currentUser && !loading) {
      navigate('/');
    }
  }, [currentUser, loading, navigate]);

  const handleRegister = async (userData) => {
    setRegisterError(null);
    const success = await register(userData);
    if (success) {
      navigate('/');
    } else {
      setRegisterError(error || 'Registration failed. Please try again.');
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Create an account</h2>
        </div>

        <RegisterForm onSubmit={handleRegister} error={registerError} />

        <div className="text-center">
          <p className="mt-2 text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
              Sign in here
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
}

export default RegisterPage;