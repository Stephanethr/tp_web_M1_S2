import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

function Register({ setIsAuthenticated }) {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    recheck_password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validation
    if (formData.password !== formData.recheck_password) {
      setError('Les mots de passe ne correspondent pas!');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const submitData = new FormData();
      Object.keys(formData).forEach(key => {
        submitData.append(key, formData[key]);
      });
      
      const response = await api.post('/register', submitData, {
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
      console.error('Register error:', err);
      setError(err.response?.data?.message || 'Une erreur est survenue lors de l\'inscription');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
  <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
    {/* Header */}
    <div className="mb-6 text-center">
      <h2 className="text-2xl font-bold text-green-500">Inscription</h2>
    </div>

    {/* Error Message */}
    {error && (
      <div className="mb-4 px-4 py-2 text-sm text-white bg-red-500 rounded">
        {error}
      </div>
    )}

    {/* Formulaire */}
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Champ Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-gray-800 focus:ring-2 focus:ring-green-500 focus:outline-none"
        />
      </div>

      {/* Champ Nom d'utilisateur */}
      <div>
        <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
          Nom d'utilisateur
        </label>
        <input
          type="text"
          id="username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
          className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-gray-800 focus:ring-2 focus:ring-green-500 focus:outline-none"
        />
      </div>

      {/* Champ Mot de passe */}
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
          Mot de passe
        </label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
          className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-gray-800 focus:ring-2 focus:ring-green-500 focus:outline-none"
        />
      </div>

      {/* Champ Confirmation du mot de passe */}
      <div>
        <label htmlFor="recheck_password" className="block text-sm font-medium text-gray-700 mb-1">
          Confirmer le mot de passe
        </label>
        <input
          type="password"
          id="recheck_password"
          name="recheck_password"
          value={formData.recheck_password}
          onChange={handleChange}
          required
          className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-gray-800 focus:ring-2 focus:ring-green-500 focus:outline-none"
        />
      </div>

      {/* Bouton d'inscription */}
      <button
        type="submit"
        className={`w-full px-4 py-2 text-white rounded-lg ${
          isLoading ? "bg-green-300 cursor-not-allowed" : "bg-green-500 hover:bg-green-600"
        }`}
        disabled={isLoading}
      >
        {isLoading ? "Inscription..." : "S'inscrire"}
      </button>
    </form>

    {/* Lien vers connexion */}
    <div className="mt-4 text-center">
      <p className="text-sm text-gray-600">
        Déjà inscrit ?{" "}
        <a href="/login" className="text-green-500 hover:text-green-600 underline">
          Se connecter
        </a>
      </p>
    </div>
  </div>
</div>

  );
}

export default Register;
