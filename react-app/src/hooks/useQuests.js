import { useState, useCallback } from 'react';
import apiService from '../services/apiService';

function useQuests() {
  const [quests, setQuests] = useState([]);
  const [currentQuest, setCurrentQuest] = useState(null);
  const [questResults, setQuestResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Récupérer la liste des quêtes disponibles
  const getAvailableQuests = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Dans un cas réel, vous récupéreriez les quêtes du backend
      // Ici nous utilisons des données statiques pour la démo
      const availableQuests = [
        {
          id: 1,
          title: 'Forest Expedition',
          description: 'Explore the enchanted forest and defeat the lurking monster.',
          difficulty: 'Easy',
          reward: 'Experience points and forest herbs',
          monster: {
            name: 'Forest Monster',
            level: 1,
            health: 50,
            attack: 10
          },
          background: 'bg-gradient-to-r from-green-500 to-emerald-700'
        },
        {
          id: 2,
          title: 'Cave Explorer',
          description: 'Venture into the dark caves and challenge the cave troll.',
          difficulty: 'Medium',
          reward: 'Gold coins and mystical gems',
          monster: {
            name: 'Cave Troll',
            level: 3,
            health: 80,
            attack: 15
          },
          background: 'bg-gradient-to-r from-gray-700 to-gray-900'
        },
        {
          id: 3,
          title: 'Dragon Slayer',
          description: 'The ultimate challenge. Face the mighty dragon that terrorizes the kingdom.',
          difficulty: 'Hard',
          reward: 'Legendary weapon and royal recognition',
          monster: {
            name: 'Dragon',
            level: 10,
            health: 200,
            attack: 40
          },
          background: 'bg-gradient-to-r from-red-600 to-orange-600'
        }
      ];
      
      setQuests(availableQuests);
      return availableQuests;
    } catch (err) {
      setError('Failed to load quests: ' + (err.message || 'Unknown error'));
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Démarrer une quête
  const startQuest = useCallback(async (questId) => {
    setLoading(true);
    setError(null);
    setQuestResults(null);
    
    try {
      const response = await apiService.startQuest(questId);
      setQuestResults(response.data);
      
      // Trouver la quête actuelle pour le contexte
      const quest = quests.find(q => q.id === questId);
      setCurrentQuest(quest);
      
      return response.data;
    } catch (err) {
      setError('Failed to start quest: ' + (err.message || 'Unknown error'));
      return null;
    } finally {
      setLoading(false);
    }
  }, [quests]);

  // Réinitialiser l'état des quêtes (pour une nouvelle session)
  const resetQuests = useCallback(() => {
    setCurrentQuest(null);
    setQuestResults(null);
    setError(null);
  }, []);

  return {
    quests,
    currentQuest,
    questResults,
    loading,
    error,
    getAvailableQuests,
    startQuest,
    resetQuests
  };
}

export default useQuests;