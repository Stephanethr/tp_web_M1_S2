import React, { useState } from 'react';
import Button from '../common/Button';

function RegisterForm({ onSubmit, error }) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    recheck_password: ''
  });
  const [validationErrors, setValidationErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const errors = {};

    // Username validation
    if (formData.username.length < 3) {
      errors.username = 'Username must be at least 3 characters long';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters long';
    }

    // Password confirmation
    if (formData.password !== formData.recheck_password) {
      errors.recheck_password = 'Passwords do not match';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
      {error && (
        <div className="bg-red-100 p-4 rounded-md text-red-700 mb-4">
          {error}
        </div>
      )}

      <div className="rounded-md shadow-sm -space-y-px">
        <div>
          <label htmlFor="username" className="sr-only">Username</label>
          <input
            id="username"
            name="username"
            type="text"
            autoComplete="username"
            required
            className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${validationErrors.username ? 'border-red-300' : 'border-gray-300'} placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
          />
          {validationErrors.username && (
            <p className="mt-1 text-sm text-red-600">{validationErrors.username}</p>
          )}
        </div>
        <div>
          <label htmlFor="email-address" className="sr-only">Email address</label>
          <input
            id="email-address"
            name="email"
            type="email"
            autoComplete="email"
            required
            className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${validationErrors.email ? 'border-red-300' : 'border-gray-300'} placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
            placeholder="Email address"
            value={formData.email}
            onChange={handleChange}
          />
          {validationErrors.email && (
            <p className="mt-1 text-sm text-red-600">{validationErrors.email}</p>
          )}
        </div>
        <div>
          <label htmlFor="password" className="sr-only">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${validationErrors.password ? 'border-red-300' : 'border-gray-300'} placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />
          {validationErrors.password && (
            <p className="mt-1 text-sm text-red-600">{validationErrors.password}</p>
          )}
        </div>
        <div>
          <label htmlFor="recheck_password" className="sr-only">Confirm Password</label>
          <input
            id="recheck_password"
            name="recheck_password"
            type="password"
            autoComplete="new-password"
            required
            className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${validationErrors.recheck_password ? 'border-red-300' : 'border-gray-300'} placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
            placeholder="Confirm password"
            value={formData.recheck_password}
            onChange={handleChange}
          />
          {validationErrors.recheck_password && (
            <p className="mt-1 text-sm text-red-600">{validationErrors.recheck_password}</p>
          )}
        </div>
      </div>

      <div>
        <Button type="submit" fullWidth>
          Create account
        </Button>
      </div>
    </form>
  );
}

export default RegisterForm;