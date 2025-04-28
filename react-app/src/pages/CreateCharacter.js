import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createCharacter } from '../api/apiService';

const CreateCharacter = () => {
  const [name, setName] = useState('');
  const [race, setRace] = useState('');
  const [characterClass, setCharacterClass] = useState('');
  const [races, setRaces] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  useEffect(() => {
    // Récupérer les options de race et de classe
    const fetchOptions = async () => {
      try {
        const response = await fetch('http://localhost:5000/game/create_character');
        const data = await response.json();
        
        if (data.success) {
          setRaces(data.options.races);
          setClasses(data.options.classes);
        }
      } catch (err) {
        setError('Erreur lors du chargement des options');
      }
    };
    
    fetchOptions();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!name || !race || !characterClass) {
      setError('Veuillez remplir tous les champs.');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const data = await createCharacter(name, race, characterClass);
      if (data.success) {
        navigate('/characters');
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Erreur lors de la création du personnage');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Créer un Nouveau Personnage</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="card max-w-lg mx-auto">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Nom du personnage
            </label>
            <input
              type="text"
              id="name"
              className="input-field w-full"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="race" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Race
            </label>
            <select
              id="race"
              className="input-field w-full"
              value={race}
              onChange={(e) => setRace(e.target.value)}
              required
            >
              <option value="">Sélectionner une race</option>
              {races.map((race) => (
                <option key={race} value={race.toLowerCase()}>
                  {race}
                </option>
              ))}
            </select>
          </div>
          
          <div className="mb-4">
            <label htmlFor="class" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Classe
            </label>
            <select
              id="class"
              className="input-field w-full"
              value={characterClass}
              onChange={(e) => setCharacterClass(e.target.value)}
              required
            >
              <option value="">Sélectionner une classe</option>
              {classes.map((cls) => (
                <option key={cls} value={cls}>
                  {cls.charAt(0).toUpperCase() + cls.slice(1)}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex justify-end">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Création...' : 'Créer le personnage'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCharacter;