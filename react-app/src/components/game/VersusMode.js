import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

function VersusMode() {
  const [characters, setCharacters] = useState([]);
  const [selectedCharacters, setSelectedCharacters] = useState({
    player1: null,
    player2: null
  });
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

  const handleCharacterSelect = (player, characterId) => {
    setSelectedCharacters(prev => ({
      ...prev,
      [player]: characterId
    }));
  };

  const startFight = async () => {
    if (!selectedCharacters.player1 || !selectedCharacters.player2) {
      setError('Veuillez sélectionner deux personnages pour commencer le combat.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('player1', selectedCharacters.player1);
      formData.append('player2', selectedCharacters.player2);
      
      const response = await api.post('/game/fight', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      // Navigate to the result page with the fight result
      navigate('/fight-result', { state: { result: response.data.result } });
    } catch (err) {
      console.error('Error starting fight:', err);
      setError('Une erreur est survenue lors du lancement du combat.');
    }
  };

  if (isLoading) {
    return <div className="text-center mt-5"><div className="spinner-border"></div></div>;
  }

  if (characters.length < 2) {
    return (
      <div className="alert alert-warning">
        Vous avez besoin d'au moins deux personnages pour le mode versus.
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
    <div className="versus-mode-container">
      <h2 className="mb-4">Mode Versus</h2>
      
      {error && <div className="alert alert-danger">{error}</div>}
      
      <div className="row">
        <div className="col-md-5">
          <div className="card">
            <div className="card-header bg-primary text-white">
              <h3 className="mb-0">Joueur 1</h3>
            </div>
            <div className="card-body">
              <div className="list-group">
                {characters.map(character => (
                  <button
                    key={`player1-${character.id}`}
                    className={`list-group-item list-group-item-action ${selectedCharacters.player1 === character.id ? 'active' : ''}`}
                    onClick={() => handleCharacterSelect('player1', character.id)}
                  >
                    <div className="d-flex justify-content-between align-items-center">
                      <span>{character.name}</span>
                      <span>Niv. {character.level}</span>
                    </div>
                    <small>
                      {character.race} {character.type} • ATK: {character.attack} • DEF: {character.defense}
                    </small>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-md-2 d-flex align-items-center justify-content-center my-3 my-md-0">
          <div className="versus-badge">
            <span className="display-4">VS</span>
          </div>
        </div>
        
        <div className="col-md-5">
          <div className="card">
            <div className="card-header bg-danger text-white">
              <h3 className="mb-0">Joueur 2</h3>
            </div>
            <div className="card-body">
              <div className="list-group">
                {characters.map(character => (
                  <button
                    key={`player2-${character.id}`}
                    className={`list-group-item list-group-item-action ${selectedCharacters.player2 === character.id ? 'active' : ''}`}
                    onClick={() => handleCharacterSelect('player2', character.id)}
                    disabled={selectedCharacters.player1 === character.id}
                  >
                    <div className="d-flex justify-content-between align-items-center">
                      <span>{character.name}</span>
                      <span>Niv. {character.level}</span>
                    </div>
                    <small>
                      {character.race} {character.type} • ATK: {character.attack} • DEF: {character.defense}
                    </small>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-4 text-center">
        <button 
          className="btn btn-danger btn-lg"
          onClick={startFight}
          disabled={!selectedCharacters.player1 || !selectedCharacters.player2}
        >
          Lancer le combat!
        </button>
        
        <button 
          className="btn btn-secondary ms-3"
          onClick={() => navigate('/character-profile')}
        >
          Retour au profil
        </button>
      </div>
    </div>
  );
}

export default VersusMode;
