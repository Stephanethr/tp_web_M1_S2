import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

function CharacterList() {
  const [characters, setCharacters] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchCharacters();
  }, []);

  const fetchCharacters = async () => {
    try {
      const response = await api.get('/game/characters');
      setCharacters(response.data.characters || []);
    } catch (err) {
      console.error('Error fetching characters:', err);
      setError('Impossible de récupérer la liste des personnages.');
    } finally {
      setIsLoading(false);
    }
  };

  const selectCharacter = async (characterId) => {
    try {
      await api.post(`/game/select_character/${characterId}`, {}, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      // Refresh the list to show the active character
      fetchCharacters();
    } catch (err) {
      console.error('Error selecting character:', err);
      setError('Impossible de sélectionner ce personnage.');
    }
  };

  if (isLoading) {
    return <div className="text-center mt-5"><div className="spinner-border"></div></div>;
  }

  return (
    <div className="character-list-container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Vos personnages</h2>
        <button 
          className="btn btn-primary" 
          onClick={() => navigate('/create-character')}
        >
          Créer un personnage
        </button>
      </div>
      
      {error && <div className="alert alert-danger">{error}</div>}
      
      {characters.length === 0 ? (
        <div className="alert alert-info">
          Vous n'avez pas encore de personnage. Créez-en un pour commencer à jouer!
        </div>
      ) : (
        <div className="row">
          {characters.map(character => (
            <div key={character.id} className="col-md-4 mb-4">
              <div className={`card ${character.isActive ? 'border-success' : ''}`}>
                <div className="card-header">
                  <h3>{character.name}</h3>
                  {character.isActive && (
                    <span className="badge bg-success">Actif</span>
                  )}
                </div>
                <div className="card-body">
                  <p><strong>Race:</strong> {character.race}</p>
                  <p><strong>Classe:</strong> {character.type}</p>
                  <p><strong>Niveau:</strong> {character.level}</p>
                  
                  <div className="progress mb-3">
                    <div 
                      className="progress-bar bg-danger" 
                      style={{ width: `${(character.health / character.maxHealth) * 100}%` }}
                    >
                      Vie: {character.health}/{character.maxHealth}
                    </div>
                  </div>
                  
                  <div className="d-flex justify-content-between">
                    <button 
                      className="btn btn-sm btn-info"
                      onClick={() => navigate(`/character-profile?id=${character.id}`)}
                    >
                      Voir détails
                    </button>
                    
                    {!character.isActive && (
                      <button 
                        className="btn btn-sm btn-success"
                        onClick={() => selectCharacter(character.id)}
                      >
                        Sélectionner
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CharacterList;
