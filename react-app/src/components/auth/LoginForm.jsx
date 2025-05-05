import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../common/Button';
import FormInput from '../common/FormInput';
import Alert from '../common/Alert';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'L\'email est requis';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Format d\'email invalide';
    }
    
    if (!formData.password) {
      newErrors.password = 'Le mot de passe est requis';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    setAlert({ type: '', message: '' });
    
    try {
      const response = await login(formData.email, formData.password);
      
      if (response.success) {
        // Redirection vers la page d'accueil
        navigate('/');
      } else {
        setAlert({ 
          type: 'error', 
          message: response.message || 'Échec de la connexion. Veuillez réessayer.'
        });
      }
    } catch (error) {
      setAlert({ 
        type: 'error', 
        message: error.message || 'Une erreur est survenue lors de la connexion.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
      <Alert 
        type={alert.type} 
        message={alert.message} 
        onClose={() => setAlert({ type: '', message: '' })} 
      />
      
      <div className="rounded-md shadow-sm space-y-4">
        <FormInput
          label="Adresse email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="email@exemple.com"
          error={errors.email}
          required
        />
        
        <FormInput
          label="Mot de passe"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          required
        />
      </div>

      <div>
        <Button 
          type="submit" 
          className="w-full" 
          disabled={loading}
        >
          {loading ? 'Connexion en cours...' : 'Se connecter'}
        </Button>
      </div>
      
      <div className="text-center mt-4">
        <p className="text-sm text-gray-600">
          Vous n'avez pas de compte ?{' '}
          <Link to="/register" className="font-medium text-primary-600 hover:text-primary-500">
            S'inscrire
          </Link>
        </p>
      </div>
    </form>
  );
};

export default LoginForm;
