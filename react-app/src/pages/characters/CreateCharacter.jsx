// src/pages/characters/CreateCharacter.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCharacters } from '../../hooks/useCharacters';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

const CreateCharacter = () => {
  const navigate = useNavigate();
  const { createCharacter, loadCharacters } = useCharacters();
  
  const [formData, setFormData] = useState({
    name: '',
    race: '',
    class: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Options spécifiques pour les races disponibles dans le jeu
  const raceOptions = [
    { value: 'HUMAN', label: 'Humain', description: 'Race équilibrée avec des bonus à toutes les statistiques.' },
    { value: 'VAMPIRE', label: 'Vampire', description: 'Excellente attaque mais faible défense. Capacités spéciales de nuit.' },
    { value: 'WEREWOLF', label: 'Loup-Garou', description: 'Haute défense et vitesse. Transformation lors des pleines lunes.' }
  ];
  
  // Options spécifiques pour les classes disponibles dans le jeu
  const classOptions = [
    { value: 'warrior', label: 'Guerrier', description: 'Spécialiste du combat rapproché avec haute défense et points de vie.' },
    { value: 'mage', label: 'Mage', description: 'Maître des arcanes avec forte attaque à distance mais faible défense.' }
  ];
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Réinitialiser les erreurs pour ce champ
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };
  
  const handleSelectChange = (fieldName, value) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }));
    
    // Réinitialiser les erreurs pour ce champ
    if (errors[fieldName]) {
      setErrors(prev => ({ ...prev, [fieldName]: null }));
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Le nom du personnage est requis';
    } else if (formData.name.length > 20) {
      newErrors.name = 'Le nom ne doit pas dépasser 20 caractères';
    }
    
    if (!formData.race) {
      newErrors.race = 'Veuillez choisir une race pour votre personnage';
    }
    
    if (!formData.class) {
      newErrors.class = 'Veuillez choisir une classe pour votre personnage';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setIsSubmitting(true);
      
      const response = await createCharacter({
        name: formData.name,
        race: formData.race,
        class: formData.class
      });
      
      // Mise à jour de l'état global des personnages
      await loadCharacters();
      
      // Redirection vers la liste des personnages ou les détails du nouveau personnage
      navigate(`/characters/${response.character?.id || ''}`);
      
    } catch (error) {
      console.error('Erreur lors de la création du personnage:', error);
      
      if (error.errors) {
        // Erreurs spécifiques par champ
        setErrors(error.errors);
      } else {
        // Erreur générale
        setErrors({
          submit: error.error || 'Une erreur est survenue lors de la création du personnage'
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <button 
          onClick={() => navigate('/characters')}
          className="mr-4 text-gray-600 hover:text-gray-900 transition-colors"
        >
          ← Retour
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Créer un nouveau personnage</h1>
      </div>

      {errors.submit && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
          <p>{errors.submit}</p>
        </div>
      )}

      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Nom du personnage
            </label>
            <Input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
              placeholder="Entrez le nom de votre personnage"
              maxLength={20}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Race</label>
            {errors.race && (
              <p className="text-sm text-red-600 mb-2">{errors.race}</p>
            )}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {raceOptions.map(option => (
                <div 
                  key={option.value}
                  onClick={() => handleSelectChange('race', option.value)}
                  className={`border rounded-lg p-4 cursor-pointer transition-colors 
                    ${formData.race === option.value 
                      ? 'border-primary bg-primary-50 ring-2 ring-primary ring-opacity-50' 
                      : 'border-gray-200 hover:bg-gray-50'}`}
                >
                  <div className="font-medium text-gray-900">{option.label}</div>
                  <p className="mt-1 text-sm text-gray-500">{option.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Classe</label>
            {errors.class && (
              <p className="text-sm text-red-600 mb-2">{errors.class}</p>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {classOptions.map(option => (
                <div 
                  key={option.value}
                  onClick={() => handleSelectChange('class', option.value)}
                  className={`border rounded-lg p-4 cursor-pointer transition-colors 
                    ${formData.class === option.value 
                      ? 'border-primary bg-primary-50 ring-2 ring-primary ring-opacity-50' 
                      : 'border-gray-200 hover:bg-gray-50'}`}
                >
                  <div className="font-medium text-gray-900">{option.label}</div>
                  <p className="mt-1 text-sm text-gray-500">{option.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              isLoading={isSubmitting}
              disabled={isSubmitting}
              className="px-6"
            >
              Créer le personnage
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCharacter;