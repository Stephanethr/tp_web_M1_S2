import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

function Login({ setIsAuthenticated }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      const formData = new FormData();
      formData.append('email', email);
      formData.append('password', password);
      
      const response = await api.post('/login', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      // Store token if your backend returns one
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      
      setIsAuthenticated(true);
      navigate('/inventory');
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Email ou mot de passe incorrect !');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
    <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-gray-800">Connexion</h2>
      </div>
  
      {error && (
        <div className="p-4 mb-4 text-red-800 bg-red-100 rounded-lg" role="alert">
          {error}
        </div>
      )}
  
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            className="w-full p-3 text-sm border-gray-300 rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
  
        <div className="mb-4">
          <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-700">
            Mot de passe
          </label>
          <input
            type="password"
            id="password"
            className="w-full p-3 text-sm border-gray-300 rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
  
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-3 text-sm font-medium text-white bg-primary-500 rounded-lg hover:bg-primary-600 focus:ring-4 focus:ring-primary-300 ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isLoading ? 'Connexion...' : 'Se connecter'}
        </button>
      </form>
  
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Pas encore de compte ?{" "}
          <a href="/register" className="font-medium text-primary-500 hover:underline">
            S'inscrire
          </a>
        </p>
      </div>
    </div>
  </div>  
  );
}

export default Login;
