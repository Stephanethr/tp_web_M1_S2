import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../../services/api';

function CharacterProfile() {
  const [character, setCharacter] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const characterId = searchParams.get('id');

  useEffect(() => {
    fetchCharacter();
  }, [characterId]);

  const fetchCharacter = async () => {
    try {
      // If ID is provided in URL, fetch that specific character
      // Otherwise, fetch the active character
      const url = characterId 
        ? `/game/character/${characterId}` 
        : '/game/character_profile';
      
      const response = await api.get(url);
      setCharacter(response.data.character);
    } catch (err) {
      console.error('Error fetching character:', err);
      setError('Impossible de récupérer les détails du personnage.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="text-center mt-5"><div className="spinner-border"></div></div>;
  }

  if (error || !character) {
    return (
      <div className="alert alert-danger">
        {error || "Aucun personnage n'a été trouvé."}
        <button 
          className="btn btn-primary ms-3"
          onClick={() => navigate('/create-character')}
        >
          Créer un personnage
        </button>
      </div>
    );
  }

  return (
    <div className="character-profile-container">
      <div className="card">
        <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
          <h2 className="mb-0">{character.name}</h2>
          <span className="badge bg-light text-dark">Niveau {character.level}</span>
        </div>
        
        <div className="card-body">
          <div className="row">
            <div className="col-md-6">
              <h3>Informations</h3>
              <ul className="list-group mb-4">
                <li className="list-group-item"><strong>Race:</strong> {character.race}</li>
                <li className="list-group-item"><strong>Classe:</strong> {character.type}</li>
                <li className="list-group-item"><strong>Niveau:</strong> {character.level}</li>
              </ul>
            </div>
            
            <div className="col-md-6">
              <h3>Statistiques</h3>
              
              <div className="mb-3">
                <label className="form-label">Vie</label>
                <div className="progress">
                  <div 
                    className="progress-bar bg-danger" 
                    style={{ width: `${(character.health / character.maxHealth) * 100}%` }}
                  >
                    {character.health}/{character.maxHealth}
                  </div>
                </div>
              </div>
              
              <div className="mb-3">
                <label className="form-label">Attaque</label>
                <div className="progress">
                  <div 
                    className="progress-bar bg-primary" 
                    style={{ width: `${(character.attack / 100) * 100}%` }}
                  >
                    {character.attack}
                  </div>
                </div>
              </div>
              
              <div className="mb-3">
                <label className="form-label">Défense</label>
                <div className="progress">
                  <div 
                    className="progress-bar bg-success" 
                    style={{ width: `${(character.defense / 100) * 100}%` }}
                  >
                    {character.defense}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-4">
            <h3>Actions</h3>
            <div className="row">
              <div className="col-6 col-md-3 mb-3">
                <button 
                  className="btn btn-primary w-100 h-100"
                  onClick={() => navigate('/quests')}
                >
                  Quêtes
                </button>
              </div>
              
              <div className="col-6 col-md-3 mb-3">
                <button 
                  className="btn btn-danger w-100 h-100"
                  onClick={() => navigate('/versus')}
                >
                  Combat
                </button>
              </div>
              
              <div className="col-6 col-md-3 mb-3">
                <button 
                  className="btn btn-success w-100 h-100"
                  onClick={() => navigate('/inventory')}
                >
                  Inventaire
                </button>
              </div>
              
              <div className="col-6 col-md-3 mb-3">
                <button 
                  className="btn btn-warning w-100 h-100"
                  onClick={() => navigate('/board-game')}
                >
                  Jeu de plateau
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CharacterProfile;
