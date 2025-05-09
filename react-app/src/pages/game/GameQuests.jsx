import { useState, useEffect } from 'react';
import API from '../..//api/index';

const GameQuests = () => {
  const [quests, setQuests] = useState([]);
  const [selectedQuest, setSelectedQuest] = useState(null);

  useEffect(() => {
    const loadQuests = async () => {
      try {
        const response = await API.get('/game/quests/');
        setQuests(response.data.quests);
      } catch (error) {
        console.error('Erreur chargement quêtes:', error);
      }
    };
    loadQuests();
  }, []);

  return (
    <div className="quests-container p-8">
      <h1 className="text-3xl font-bold mb-6">Quêtes Disponibles</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quests.map(quest => (
          <div 
            key={quest.id}
            className="quest-card bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            onClick={() => setSelectedQuest(quest)}
          >
            <h3 className="text-xl font-semibold mb-2">{quest.title}</h3>
            <p className="text-gray-600 mb-3">{quest.description}</p>
            <div className="quest-details text-sm text-gray-500">
              <span>Niveau : {quest.min_level}+ | Récompense : {quest.reward_gold} 🪙</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GameQuests;