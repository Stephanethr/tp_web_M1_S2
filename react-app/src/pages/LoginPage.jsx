import React from 'react';
import LoginForm from '../components/auth/LoginForm';
import AuthCard from '../components/auth/AuthCard';

const LoginPage = () => {
  return (
    <AuthCard title="Connexion">
      <LoginForm />
    </AuthCard>
  );
};

export default LoginPage;
