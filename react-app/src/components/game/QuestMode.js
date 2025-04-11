import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

function QuestMode() {
  const [quests, setQuests] = useState([
    {
      id: 1,
      name: "La forêt mystérieuse",
      description: "Éliminez le monstre de la forêt qui terrorise les villageois.",
      difficulty: "Facile",
      reward: "50 pièces d'or, 1 potion"
    },
    {
      id: 2,
      name: "Les cavernes obscures",
      description: "Explorez les cavernes et éliminez le troll qui y habite.",
      difficulty: "Moyen",
      reward: "100 pièces d'or, 1 armure légère"
    },
    {
      id: 3,
      name: "L'antre du dragon",
      description: "Affrontez le dragon et récupérez son trésor.",
      difficulty: "Difficile",
      reward: "500 pièces d'or, 1 arme légendaire"
    }
  ]);
  const [character, setCharacter] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch character data to ensure player has a character
    const fetchCharacter = async () => {
      try {
        const response = await api.get('/game/character_profile');
        setCharacter(response.data.character);
      } catch (err) {
        console.error('Error fetching character:', err);
        setError('Impossible de récupérer les détails du personnage.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCharacter();
  }, []);

  const startQuest = async (questId) => {
    try {
      const response = await api.post(`/game/quest/${questId}`, {}, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      // Redirect to the fight result page with the result data
      navigate('/fight-result', { state: { result: response.data.result } });
    } catch (err) {
      console.error('Error starting quest:', err);
      setError('Une erreur est survenue lors du lancement de la quête.');
    }
  };

  if (isLoading) {
    return <div className="text-center mt-5"><div className="spinner-border"></div></div>;
  }

  if (!character) {
    return (
      <div className="alert alert-warning">
        Vous devez créer ou sélectionner un personnage avant de pouvoir accéder aux quêtes.
        <button 
          className="btn btn-primary ms-3"
          onClick={() => navigate('/characters')}
        >
          Mes personnages
        </button>
      </div>
    );
  }

  return (
    <div className="quest-mode-container">
      <h2>Quêtes disponibles</h2>
      
      {error && <div className="alert alert-danger">{error}</div>}
      
      <div className="row mt-4">
        {quests.map(quest => (
          <div key={quest.id} className="col-md-4 mb-4">
            <div className="card h-100">
              <div className="card-header">
                <h3>{quest.name}</h3>
                <span className={`badge ${
                  quest.difficulty === 'Facile' ? 'bg-success' :
                  quest.difficulty === 'Moyen' ? 'bg-warning' :
                  'bg-danger'
                }`}>
                  {quest.difficulty}
                </span>
              </div>
              <div className="card-body">
                <p>{quest.description}</p>
                <p><strong>Récompense:</strong> {quest.reward}</p>
              </div>
              <div className="card-footer">
                <button 
                  className="btn btn-primary w-100"
                  onClick={() => startQuest(quest.id)}
                >
                  Démarrer la quête
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4">
        <button 
          className="btn btn-secondary"
          onClick={() => navigate('/character-profile')}
        >
          Retour au profil
        </button>
      </div>
    </div>
  );
}

export default QuestMode;
