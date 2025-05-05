import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import characterService from '../../services/characterService';
import { useAuth } from '../../contexts/AuthContext';

const CharacterForm = () => {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    race_id: '',
    class: ''
  });
  
  const [races, setRaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  
  useEffect(() => {
    const fetchRaces = async () => {
      try {
        setLoading(true);
        const response = await characterService.getRaces();
        if (response.success) {
          setRaces(response.races);
          if (response.races.length > 0) {
            setFormData(prev => ({
              ...prev,
              race_id: response.races[0].id
            }));
          }
        } else {
          setError('Erreur lors du chargement des races');
        }
      } catch (err) {
        setError('Erreur de communication avec le serveur');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRaces();
  }, []);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await characterService.createCharacter(formData);
      
      if (response.success) {
        setSuccessMessage('Personnage créé avec succès!');
        setTimeout(() => {
          refreshUser();
          navigate('/dashboard');
        }, 1500);
      } else {
        setError(response.message || 'Erreur lors de la création du personnage');
      }
    } catch (err) {
      setError('Erreur de communication avec le serveur');
      console.error(err);
    }
  };
  
  if (loading) {
    return <div className="loading">Chargement des données...</div>;
  }
  
  const selectedRace = races.find(race => race.id === parseInt(formData.race_id));
  
  return (
    <div className="character-creation-container">
      <h2>Créer un nouveau personnage</h2>
      {error && <div className="error-message">{error}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}
      
      <form onSubmit={handleSubmit} className="creation-form">
        <div className="form-group">
          <label htmlFor="name">Nom du personnage:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            minLength="3"
            maxLength="20"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="race_id">Race:</label>
          <select
            id="race_id"
            name="race_id"
            value={formData.race_id}
            onChange={handleChange}
            required
          >
            {races.map(race => (
              <option key={race.id} value={race.id}>{race.name}</option>
            ))}
          </select>
        </div>
        
        {selectedRace && (
          <div className="race-details">
            <p><strong>Description:</strong> {selectedRace.description}</p>
            <div className="race-bonuses">
              <p>Bonus de santé: <span>+{selectedRace.health_bonus}</span></p>
              <p>Bonus d'attaque: <span>+{selectedRace.attack_bonus}</span></p>
              <p>Bonus de défense: <span>+{selectedRace.defense_bonus}</span></p>
            </div>
          </div>
        )}
        
        <div className="form-group">
          <label htmlFor="class">Classe:</label>
          <select
            id="class"
            name="class"
            value={formData.class}
            onChange={handleChange}
            required
          >
            <option value="">Sélectionnez une classe</option>
            <option value="warrior">Guerrier</option>
            <option value="mage">Mage</option>
          </select>
        </div>
        
        {formData.class && (
          <div className="class-details">
            <h3>{formData.class === 'warrior' ? 'Guerrier' : 'Mage'}</h3>
            <p>
              {formData.class === 'warrior' 
                ? 'Les guerriers excellent au combat rapproché et possèdent une meilleure défense et endurance.'
                : 'Les mages maîtrisent les arts mystiques et peuvent infliger de lourds dégâts à distance.'}
            </p>
            <div className="class-bonuses">
              {formData.class === 'warrior' ? (
                <>
                  <p>Santé: <span>+20</span></p>
                  <p>Attaque: <span>+5</span></p>
                  <p>Défense: <span>+10</span></p>
                </>
              ) : (
                <>
                  <p>Santé: <span>+0</span></p>
                  <p>Attaque: <span>+15</span></p>
                  <p>Défense: <span>+0</span></p>
                </>
              )}
            </div>
          </div>
        )}
        
        <button type="submit" className="create-btn">Créer Personnage</button>
      </form>
    </div>
  );
};

export default CharacterForm;
