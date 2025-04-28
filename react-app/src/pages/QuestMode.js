import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getQuests, startQuest } from '../api/apiService';

const QuestMode = () => {
  const [character, setCharacter] = useState(null);
  const [quests, setQuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuests = async () => {
      try {
        const data = await getQuests();
        if (data.success) {
          setCharacter(data.character);
          setQuests(data.quests);
        } else {
          setError(data.message);
          if (data.redirect) {
            navigate(data.redirect);
          }
        }
      } catch (err) {
        setError('Erreur lors du chargement des quêtes');
      } finally {
        setLoading(false);
      }
    };

    fetchQuests();
  }, [navigate]);

  const handleStartQuest = async (questId) => {
    setLoading(true);
    try {
      const data = await startQuest(questId);
      if (data.success) {
        // Stocker le résultat dans sessionStorage pour y accéder dans la page de résultat
        sessionStorage.setItem('questResult', JSON.stringify(data.result));
        navigate('/quest-result');
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Erreur lors du démarrage de la quête');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-10">Chargement...</div>;
  }

  // Affichage des difficultés avec différentes couleurs
  const difficultyColor = {
    'Facile': 'bg-green-100 text-green-800',
    'Moyen': 'bg-yellow-100 text-yellow-800',
    'Difficile': 'bg-red-100 text-red-800'
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Mode Quête</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {character && (
        <div className="mb-6 card">
          <h2 className="text-xl font-bold mb-2">Votre personnage : {character.name}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-600">Niveau</p>
              <p className="font-medium">{character.level}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Points de vie</p>
              <p className="font-medium">{character.health}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Attaque</p>
              <p className="font-medium">{character.attack}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Défense</p>
              <p className="font-medium">{character.defense}</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {quests.map((quest) => (
          <div key={quest.id} className="card hover:shadow-lg transition-shadow">
            <div className="mb-4">
              <h3 className="text-lg font-bold">{quest.name}</h3>
              <span className={`inline-block px-2 py-1 text-xs rounded ${difficultyColor[quest.difficulty]}`}>
                {quest.difficulty}
              </span>
            </div>
            
            <p className="text-gray-600 mb-4">{quest.description}</p>
            
            <div className="mb-4">
              <h4 className="text-sm font-semibold mb-1">Adversaire:</h4>
              <div className="flex items-center">
                <div className="mr-4">
                  <p className="text-sm text-gray-600">Nom</p>
                  <p className="font-medium">{quest.opponent.name}</p>
                </div>
                <div className="mr-4">
                  <p className="text-sm text-gray-600">PV</p>
                  <p className="font-medium">{quest.opponent.health}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Attaque</p>
                  <p className="font-medium">{quest.opponent.attack}</p>
                </div>
              </div>
            </div>
            
            <div className="mb-2">
              <h4 className="text-sm font-semibold mb-1">Récompenses:</h4>
              <ul className="list-disc list-inside text-sm">
                <li>{quest.rewards.xp} points d'expérience</li>
                {quest.rewards.gold && <li>{quest.rewards.gold} pièces d'or</li>}
                {quest.rewards.items && quest.rewards.items.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
            
            <button
              onClick={() => handleStartQuest(quest.id)}
              className="btn btn-primary w-full mt-2"
              disabled={loading}
            >
              {loading ? 'Chargement...' : 'Commencer la quête'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuestMode;
