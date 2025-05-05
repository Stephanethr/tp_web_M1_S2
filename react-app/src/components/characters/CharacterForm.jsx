import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ClassSelection from './ClassSelection';
import characterService from '../../services/characterService';

const CharacterForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    race: '',
    class: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');
  
  const navigate = useNavigate();
  
  const races = [
    { id: 'human', name: 'Humain', description: 'Polyvalent et adaptable, +1 à toutes les caractéristiques' },
    { id: 'elf', name: 'Elfe', description: 'Agile et magique, +2 intelligence, +1 agilité' },
    { id: 'dwarf', name: 'Nain', description: 'Robuste et endurant, +2 défense, +1 force' },
    { id: 'orc', name: 'Orc', description: 'Fort et redoutable, +3 force, -1 intelligence' }
  ];

  const classes = [
    { 
      id: 'warrior', 
      name: 'Guerrier', 
      description: 'Maître du combat rapproché, spécialiste des armes et armures', 
      stats: 'Force élevée, Défense élevée'
    },
    { 
      id: 'mage', 
      name: 'Mage', 
      description: 'Manipulateur des énergies magiques et lanceur de sorts', 
      stats: 'Intelligence élevée, Puissance magique élevée'
    }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Réinitialiser l'erreur pour le champ modifié
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  const handleRaceSelect = (raceId) => {
    setFormData(prev => ({ ...prev, race: raceId }));
    if (errors.race) {
      setErrors(prev => ({ ...prev, race: '' }));
    }
  };

  const handleClassSelect = (classId) => {
    setFormData(prev => ({ ...prev, class: classId }));
    if (errors.class) {
      setErrors(prev => ({ ...prev, class: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Le nom du personnage est requis";
    } else if (formData.name.length < 3) {
      newErrors.name = "Le nom doit contenir au moins 3 caractères";
    }
    
    if (!formData.race) {
      newErrors.race = "Veuillez sélectionner une race";
    }
    
    if (!formData.class) {
      newErrors.class = "Veuillez sélectionner une classe";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    setApiError('');
    
    try {
      const response = await characterService.createCharacter(formData);
      
      if (response.success) {
        navigate('/characters');
      } else {
        setApiError(response.message || "Une erreur s'est produite lors de la création du personnage");
      }
    } catch (error) {
      console.error("Erreur lors de la création du personnage:", error);
      setApiError(error.response?.data?.message || "Une erreur s'est produite lors de la création du personnage");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {apiError && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <div className="flex">
            <div>
              <p className="text-sm text-red-700">
                {apiError}
              </p>
            </div>
          </div>
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Nom du personnage
        </label>
        <div className="mt-1">
          <input
            type="text"
            name="name"
            id="name"
            value={formData.name}
            onChange={handleInputChange}
            className={`shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md ${
              errors.name ? 'border-red-300' : ''
            }`}
            placeholder="Entrez le nom de votre héros"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
          )}
        </div>
      </div>

      <div>
        <span className="block text-sm font-medium text-gray-700 mb-2">
          Race
        </span>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {races.map((race) => (
            <div
              key={race.id}
              onClick={() => handleRaceSelect(race.id)}
              className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                formData.race === race.id
                  ? 'bg-primary-50 border-primary-500'
                  : 'bg-white hover:bg-gray-50 border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-900">{race.name}</h3>
                {formData.race === race.id && (
                  <svg className="h-5 w-5 text-primary-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <p className="mt-1 text-xs text-gray-500">{race.description}</p>
            </div>
          ))}
        </div>
        {errors.race && (
          <p className="mt-1 text-sm text-red-600">{errors.race}</p>
        )}
      </div>

      <div>
        <span className="block text-sm font-medium text-gray-700 mb-2">
          Classe
        </span>
        <ClassSelection 
          classes={classes} 
          selectedClass={formData.class} 
          onSelectClass={handleClassSelect} 
        />
        {errors.class && (
          <p className="mt-1 text-sm text-red-600">{errors.class}</p>
        )}
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={() => navigate('/characters')}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${
            isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
          }`}
        >
          {isSubmitting ? 'Création en cours...' : 'Créer le personnage'}
        </button>
      </div>
    </form>
  );
};

export default CharacterForm;
