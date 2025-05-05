import React from 'react';
import RegisterForm from '../components/auth/RegisterForm';
import AuthCard from '../components/auth/AuthCard';

const RegisterPage = () => {
  return (
    <AuthCard title="Créer un compte">
      <RegisterForm />
    </AuthCard>
  );
};

export default RegisterPage;
