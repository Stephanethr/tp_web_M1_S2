import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

function CharacterCreation() {
  const [formData, setFormData] = useState({
    name: '',
    race: 'human', // valeur par défaut
    class: 'warrior' // valeur par défaut
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
    setIsLoading(true);
    
    try {
      const submitData = new FormData();
      Object.keys(formData).forEach(key => {
        submitData.append(key, formData[key]);
      });
      
      await api.post('/game/create_character', submitData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      navigate('/character-profile');
    } catch (err) {
      console.error('Character creation error:', err);
      setError(err.response?.data?.message || 'Une erreur est survenue lors de la création du personnage');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="character-creation-container">
      <div className="card">
        <div className="card-header bg-primary text-white">
          <h2 className="mb-0">Créer un nouveau personnage</h2>
        </div>
        <div className="card-body">
          {error && <div className="alert alert-danger">{error}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">Nom du personnage</label>
              <input
                type="text"
                className="form-control"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="mb-3">
              <label htmlFor="race" className="form-label">Race</label>
              <select
                className="form-select"
                id="race"
                name="race"
                value={formData.race}
                onChange={handleChange}
                required
              >
                <option value="human">Humain</option>
                <option value="elf">Elfe</option>
                <option value="dwarf">Nain</option>
                <option value="orc">Orc</option>
              </select>
            </div>
            
            <div className="mb-3">
              <label htmlFor="class" className="form-label">Classe</label>
              <select
                className="form-select"
                id="class"
                name="class"
                value={formData.class}
                onChange={handleChange}
                required
              >
                <option value="warrior">Guerrier</option>
                <option value="mage">Mage</option>
              </select>
            </div>
            
            <div className="d-grid gap-2">
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={isLoading}
              >
                {isLoading ? 'Création...' : 'Créer le personnage'}
              </button>
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={() => navigate('/characters')}
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CharacterCreation;
