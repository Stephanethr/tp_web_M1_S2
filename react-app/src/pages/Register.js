import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../api/apiService';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    recheck_password: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
    // Effacer l'erreur pour ce champ si l'utilisateur modifie la valeur
    if (errors[name]) {
      setErrors(prevErrors => ({
        ...prevErrors,
        [name]: null
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Vérifier que les champs obligatoires sont remplis
    if (!formData.email.trim()) newErrors.email = "L'email est obligatoire";
    if (!formData.username.trim()) newErrors.username = "Le nom d'utilisateur est obligatoire";
    if (!formData.password) newErrors.password = "Le mot de passe est obligatoire";
    if (!formData.recheck_password) newErrors.recheck_password = "La confirmation du mot de passe est obligatoire";
    
    // Vérifier que l'email est au format valide
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = "Format d'email invalide";
    }
    
    // Vérifier que le mot de passe est assez fort (au moins 6 caractères)
    if (formData.password && formData.password.length < 6) {
      newErrors.password = "Le mot de passe doit contenir au moins 6 caractères";
    }
    
    // Vérifier que les mots de passe correspondent
    if (formData.password && formData.recheck_password && formData.password !== formData.recheck_password) {
      newErrors.recheck_password = "Les mots de passe ne correspondent pas";
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Valider le formulaire
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    try {
      setIsSubmitting(true);
      const response = await register(formData);
      if (response.success) {
        // Connecter automatiquement l'utilisateur après l'inscription
        await login(formData.email, formData.password);
        navigate('/');
      }
    } catch (error) {
        if (error.response && error.response.data && error.response.data.errors) {
            setErrors(error.response.data.errors);
          } else {
            setErrors({
              general: error.message || "Une erreur s'est produite lors de l'inscription. Veuillez réessayer."
            });
          }
        } finally {
          setIsSubmitting(false);
        }
      };
    
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8">
            <div>
              <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
                Créer un compte
              </h2>
              <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
                Ou{' '}
                <Link to="/login" className="font-medium text-accent hover:text-accent/80">
                  connectez-vous à votre compte existant
                </Link>
              </p>
            </div>
            
            {errors.general && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded" role="alert">
                <span className="block sm:inline">{errors.general}</span>
              </div>
            )}
            
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              <div className="rounded-md shadow-sm space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Adresse email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className={`appearance-none rounded-md relative block w-full px-3 py-2 border ${
                      errors.email ? 'border-red-300' : 'border-gray-300'
                    } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-accent focus:border-accent`}
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                  {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                </div>
                
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Nom d'utilisateur
                  </label>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    autoComplete="username"
                    required
                    className={`appearance-none rounded-md relative block w-full px-3 py-2 border ${
                      errors.username ? 'border-red-300' : 'border-gray-300'
                    } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-accent focus:border-accent`}
                    placeholder="Nom d'utilisateur"
                    value={formData.username}
                    onChange={handleChange}
                  />
                  {errors.username && <p className="mt-1 text-sm text-red-600">{errors.username}</p>}
                </div>
                
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Mot de passe
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className={`appearance-none rounded-md relative block w-full px-3 py-2 border ${
                      errors.password ? 'border-red-300' : 'border-gray-300'
                    } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-accent focus:border-accent`}
                    placeholder="Mot de passe"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                </div>
                
                <div>
                  <label htmlFor="recheck_password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Confirmer le mot de passe
                  </label>
                  <input
                    id="recheck_password"
                    name="recheck_password"
                    type="password"
                    autoComplete="new-password"
                    required
                    className={`appearance-none rounded-md relative block w-full px-3 py-2 border ${
                      errors.recheck_password ? 'border-red-300' : 'border-gray-300'
                    } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-accent focus:border-accent`}
                    placeholder="Confirmer le mot de passe"
                    value={formData.recheck_password}
                    onChange={handleChange}
                  />
                  {errors.recheck_password && <p className="mt-1 text-sm text-red-600">{errors.recheck_password}</p>}
                </div>
              </div>
    
              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-accent hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent disabled:opacity-75"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Création en cours...
                    </>
                  ) : (
                    "S'inscrire"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      );
    };
    
    export default Register;
    