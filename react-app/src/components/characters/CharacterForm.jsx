// CharacterForm.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Helmet } from 'react-helmet';
import characterService from '../../services/characterService';

const CharacterForm = () => {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();
  
  // States
  const [formData, setFormData] = useState({
    name: '',
    race_id: '',
    class: ''
  });
  const [races, setRaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });
  
  // Classes disponibles
  const availableClasses = [
    { id: 'warrior', name: 'Guerrier', description: 'Les guerriers excellent au combat rapproché et possèdent une meilleure défense et endurance.', bonuses: { health: 20, attack: 5, defense: 10 } },
    { id: 'mage', name: 'Mage', description: 'Les mages maîtrisent les arts mystiques et peuvent infliger de lourds dégâts à distance.', bonuses: { health: 0, attack: 15, defense: 0 } }
  ];
  
  // Récupération des races à l'initialisation
  useEffect(() => {
    const fetchRaces = async () => {
      try {
        setLoading(true);
        const response = await characterService.getRaces();
        
        if (response.success && response.races.length > 0) {
          setRaces(response.races);
          setFormData(prev => ({
            ...prev,
            race_id: response.races[0].id.toString()
          }));
        } else {
          setAlert({
            show: true,
            type: 'error',
            message: "Impossible de charger les races disponibles."
          });
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des races:", error);
        setAlert({
          show: true,
          type: 'error',
          message: "Erreur de communication avec le serveur."
        });
      } finally {
        setLoading(false);
      }
    };

    fetchRaces();
  }, []);

  // Gestionnaires d'événements
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.race_id || !formData.class) {
      setAlert({
        show: true,
        type: 'error',
        message: "Veuillez remplir tous les champs."
      });
      return;
    }
    
    try {
      setSubmitting(true);
      setAlert({ show: false, type: '', message: '' });
      
      const response = await characterService.createCharacter(formData);
      
      if (response.success) {
        setAlert({
          show: true,
          type: 'success',
          message: "Personnage créé avec succès!"
        });
        
        setTimeout(() => {
          refreshUser();
          navigate('/characters');
        }, 1500);
      } else {
        setAlert({
          show: true,
          type: 'error',
          message: response.message || "Une erreur est survenue lors de la création du personnage."
        });
      }
    } catch (error) {
      console.error("Erreur lors de la création du personnage:", error);
      setAlert({
        show: true,
        type: 'error',
        message: "Erreur de communication avec le serveur."
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Calcul des informations de la race sélectionnée
  const selectedRace = races.find(race => race.id === parseInt(formData.race_id));
  
  // Calcul des informations de la classe sélectionnée
  const selectedClass = availableClasses.find(cls => cls.id === formData.class);

  return (
    <div className="container mx-auto px-4 py-8">
      <Helmet>
        <title>Créer un personnage | RPG Game</title>
      </Helmet>
      
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow-sm rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
            Créer un nouveau personnage
          </h2>
          
          {/* Alert */}
          {alert.show && (
            <div className={`mb-6 p-4 rounded-md ${alert.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              <p className="flex items-center">
                {alert.type === 'success' ? (
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                ) : (
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path>
                  </svg>
                )}
                {alert.message}
              </p>
            </div>
          )}
          
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              <span className="ml-3 text-gray-600">Chargement des données...</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Nom du personnage */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Nom du personnage
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Entrez un nom pour votre personnage"
                  required
                  minLength="3"
                  maxLength="20"
                  disabled={submitting}
                />
                <p className="mt-1 text-sm text-gray-500">
                  Le nom doit contenir entre 3 et 20 caractères
                </p>
              </div>

              {/* Sélection de la race */}
              <div>
                <label htmlFor="race_id" className="block text-sm font-medium text-gray-700 mb-1">
                  Race
                </label>
                <select
                  id="race_id"
                  name="race_id"
                  value={formData.race_id}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                  disabled={submitting}
                >
                  {races.map(race => (
                    <option key={race.id} value={race.id}>{race.name}</option>
                  ))}
                </select>
              </div>

              {/* Affichage des détails de la race sélectionnée */}
              {selectedRace && (
                <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                  <h3 className="font-semibold text-lg text-gray-800 mb-2">{selectedRace.name}</h3>
                  <p className="text-gray-600 mb-4">{selectedRace.description}</p>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-gray-100 p-3 rounded text-center">
                      <span className="block text-sm text-gray-500 mb-1">Santé</span>
                      <span className={`font-medium ${selectedRace.health_bonus > 0 ? 'text-green-600' : selectedRace.health_bonus < 0 ? 'text-red-600' : 'text-gray-900'}`}>
                        {selectedRace.health_bonus > 0 ? `+${selectedRace.health_bonus}` : selectedRace.health_bonus}
                      </span>
                    </div>
                    <div className="bg-gray-100 p-3 rounded text-center">
                      <span className="block text-sm text-gray-500 mb-1">Attaque</span>
                      <span className={`font-medium ${selectedRace.attack_bonus > 0 ? 'text-green-600' : selectedRace.attack_bonus < 0 ? 'text-red-600' : 'text-gray-900'}`}>
                        {selectedRace.attack_bonus > 0 ? `+${selectedRace.attack_bonus}` : selectedRace.attack_bonus}
                      </span>
                    </div>
                    <div className="bg-gray-100 p-3 rounded text-center">
                      <span className="block text-sm text-gray-500 mb-1">Défense</span>
                      <span className={`font-medium ${selectedRace.defense_bonus > 0 ? 'text-green-600' : selectedRace.defense_bonus < 0 ? 'text-red-600' : 'text-gray-900'}`}>
                        {selectedRace.defense_bonus > 0 ? `+${selectedRace.defense_bonus}` : selectedRace.defense_bonus}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Sélection de la classe */}
              <div>
                <label htmlFor="class" className="block text-sm font-medium text-gray-700 mb-1">
                  Classe
                </label>
                <select
                  id="class"
                  name="class"
                  value={formData.class}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                  disabled={submitting}
                >
                  <option value="">Sélectionnez une classe</option>
                  {availableClasses.map(cls => (
                    <option key={cls.id} value={cls.id}>{cls.name}</option>
                  ))}
                </select>
              </div>

              {/* Affichage des détails de la classe sélectionnée */}
              {selectedClass && (
                <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                  <h3 className="font-semibold text-lg text-gray-800 mb-2">{selectedClass.name}</h3>
                  <p className="text-gray-600 mb-4">{selectedClass.description}</p>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-gray-100 p-3 rounded text-center">
                      <span className="block text-sm text-gray-500 mb-1">Santé</span>
                      <span className={`font-medium ${selectedClass.bonuses.health > 0 ? 'text-green-600' : selectedClass.bonuses.health < 0 ? 'text-red-600' : 'text-gray-900'}`}>
                        {selectedClass.bonuses.health > 0 ? `+${selectedClass.bonuses.health}` : selectedClass.bonuses.health}
                      </span>
                    </div>
                    <div className="bg-gray-100 p-3 rounded text-center">
                      <span className="block text-sm text-gray-500 mb-1">Attaque</span>
                      <span className={`font-medium ${selectedClass.bonuses.attack > 0 ? 'text-green-600' : selectedClass.bonuses.attack < 0 ? 'text-red-600' : 'text-gray-900'}`}>
                        {selectedClass.bonuses.attack > 0 ? `+${selectedClass.bonuses.attack}` : selectedClass.bonuses.attack}
                      </span>
                    </div>
                    <div className="bg-gray-100 p-3 rounded text-center">
                      <span className="block text-sm text-gray-500 mb-1">Défense</span>
                      <span className={`font-medium ${selectedClass.bonuses.defense > 0 ? 'text-green-600' : selectedClass.bonuses.defense < 0 ? 'text-red-600' : 'text-gray-900'}`}>
                        {selectedClass.bonuses.defense > 0 ? `+${selectedClass.bonuses.defense}` : selectedClass.bonuses.defense}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Affichage du récapitulatif des statistiques */}
              {selectedRace && selectedClass && (
                <div className="bg-blue-50 p-4 rounded-md border border-blue-200">
                  <h3 className="font-semibold text-lg text-blue-800 mb-3">Statistiques de départ</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-white p-3 rounded shadow-sm text-center">
                      <span className="block text-sm text-gray-500 mb-1">Santé</span>
                      <span className="font-bold text-xl text-blue-700">
                        {100 + selectedRace.health_bonus + selectedClass.bonuses.health}
                      </span>
                    </div>
                    <div className="bg-white p-3 rounded shadow-sm text-center">
                      <span className="block text-sm text-gray-500 mb-1">Attaque</span>
                      <span className="font-bold text-xl text-blue-700">
                        {10 + selectedRace.attack_bonus + selectedClass.bonuses.attack}
                      </span>
                    </div>
                    <div className="bg-white p-3 rounded shadow-sm text-center">
                      <span className="block text-sm text-gray-500 mb-1">Défense</span>
                      <span className="font-bold text-xl text-blue-700">
                        {5 + selectedRace.defense_bonus + selectedClass.bonuses.defense}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Bouton de soumission */}
              <div className="flex justify-center">
                <button 
                  type="submit" 
                  className={`px-6 py-3 rounded-md font-medium text-white ${
                    submitting || !formData.name || !formData.race_id || !formData.class
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                  }`}
                  disabled={submitting || !formData.name || !formData.race_id || !formData.class}
                >
                  {submitting ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Création en cours...
                    </span>
                  ) : (
                    'Créer le personnage'
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default CharacterForm;
