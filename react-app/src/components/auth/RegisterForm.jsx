import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../common/Button';
import FormInput from '../common/FormInput';
import Alert from '../common/Alert';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
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
    
    if (!formData.username) {
      newErrors.username = 'Le nom d\'utilisateur est requis';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Le nom d\'utilisateur doit contenir au moins 3 caractères';
    }
    
    if (!formData.email) {
      newErrors.email = 'L\'email est requis';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Format d\'email invalide';
    }
    
    if (!formData.password) {
      newErrors.password = 'Le mot de passe est requis';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
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
      const response = await register(
        formData.username, 
        formData.email, 
        formData.password
      );
      
      if (response.success) {
        setAlert({
          type: 'success',
          message: 'Inscription réussie! Vous allez être redirigé vers la page de connexion.'
        });
        
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setAlert({ 
          type: 'error', 
          message: response.message || 'Échec de l\'inscription. Veuillez réessayer.'
        });
      }
    } catch (error) {
      setAlert({ 
        type: 'error', 
        message: error.message || 'Une erreur est survenue lors de l\'inscription.'
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
          label="Nom d'utilisateur"
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="Votre nom d'utilisateur"
          error={errors.username}
          required
        />
        
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
        
        <FormInput
          label="Confirmer le mot de passe"
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
          required
        />
      </div>

      <div>
        <Button 
          type="submit" 
          className="w-full" 
          disabled={loading}
        >
          {loading ? 'Inscription en cours...' : 'S\'inscrire'}
        </Button>
      </div>
      
      <div className="text-center mt-4">
        <p className="text-sm text-gray-600">
          Vous avez déjà un compte ?{' '}
          <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
            Se connecter
          </Link>
        </p>
      </div>
    </form>
  );
};

export default RegisterForm;
