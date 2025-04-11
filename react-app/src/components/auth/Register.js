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
    <div className="register-container">
      <div className="card">
        <div className="card-header bg-success text-white">
          <h2 className="mb-0">Inscription</h2>
        </div>
        <div className="card-body">
          {error && <div className="alert alert-danger">{error}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="mb-3">
              <label htmlFor="username" className="form-label">Nom d'utilisateur</label>
              <input
                type="text"
                className="form-control"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Mot de passe</label>
              <input
                type="password"
                className="form-control"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="mb-3">
              <label htmlFor="recheck_password" className="form-label">Confirmer le mot de passe</label>
              <input
                type="password"
                className="form-control"
                id="recheck_password"
                name="recheck_password"
                value={formData.recheck_password}
                onChange={handleChange}
                required
              />
            </div>
            
            <button 
              type="submit" 
              className="btn btn-success w-100"
              disabled={isLoading}
            >
              {isLoading ? 'Inscription...' : 'S\'inscrire'}
            </button>
          </form>
          
          <div className="mt-3 text-center">
            <p>
              Déjà inscrit ? <a href="/login">Se connecter</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
