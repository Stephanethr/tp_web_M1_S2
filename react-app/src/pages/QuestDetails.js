import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getQuestDetails, startQuest } from '../api/apiService';

const QuestDetails = () => {
  const { questId } = useParams();
  const navigate = useNavigate();
  const [quest, setQuest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [starting, setStarting] = useState(false);

  // Liste statique de quêtes (à remplacer par un appel API)
  const questData = {
    1: {
      id: 1,
      title: "Forêt Enchantée",
      description: "Explorez la forêt mystérieuse et affrontez le monstre qui y rôde.",
      difficulty: "Facile",
      reward: "50 pièces d'or, 1 potion de santé",
      monster: "Monstre de la forêt",
      monsterHealth: 50,
      monsterAttack: 10,
      image: "forest.jpg"
    },
    2: {
      id: 2,
      title: "Cavernes Sombres",
      description: "Descendez dans les profondeurs des cavernes et combattez le troll qui terrorise les mineurs.",
      difficulty: "Moyen",
      reward: "100 pièces d'or, 1 équipement rare",
      monster: "Troll des cavernes",
      monsterHealth: 80,
      monsterAttack: 15,
      image: "cave.jpg"
    },
    3: {
      id: 3,
      title: "Montagne du Dragon",
      description: "Escaladez la montagne périlleuse et affrontez le dragon ancestral qui y sommeille.",
      difficulty: "Difficile",
      reward: "300 pièces d'or, 1 arme légendaire",
      monster: "Dragon",
      monsterHealth: 200,
      monsterAttack: 40,
      image: "mountain.jpg"
    }
  };

  useEffect(() => {
    const loadQuest = async () => {
      try {
        setLoading(true);
        // Dans un cas réel, vous feriez un appel API pour récupérer les détails de la quête
        // const data = await getQuestDetails(questId);
        
        // Pour l'instant, utilisons des données statiques
        if (questData[questId]) {
          setQuest(questData[questId]);
        } else {
          setError("Quête introuvable");
        }
      } catch (err) {
        setError("Erreur lors du chargement des détails de la quête");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadQuest();
  }, [questId]);

  const handleStartQuest = async () => {
    try {
      setStarting(true);
      // Dans une implémentation réelle, vous feriez un appel API
      // const result = await startQuest(questId);
      
      // Simuler un délai pour montrer le chargement
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Rediriger vers le résultat du combat
      navigate(`/quest/${questId}/result`, { 
        state: { 
          questName: quest.title,
          monsterName: quest.monster
        }
      });
    } catch (err) {
      setError("Erreur lors du lancement de la quête");
      console.error(err);
      setStarting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-8" role="alert">
          <p>{error}</p>
        </div>
        <div className="flex justify-center">
          <Link to="/quests" className="btn-secondary">
            Retour aux quêtes
          </Link>
        </div>
      </div>
    );
  }

  if (!quest) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Quête introuvable</h2>
        <p className="mb-8">La quête que vous recherchez n'existe pas.</p>
        <Link to="/quests" className="btn-primary">
          Retour aux quêtes
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="md:flex">
          <div className="md:flex-shrink-0">
            <div className="h-48 w-full md:w-48 bg-gray-300 dark:bg-gray-700 flex items-center justify-center">
              <svg className="h-12 w-12 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
              </svg>
            </div>
          </div>
          <div className="p-8 flex-1">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{quest.title}</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Difficulté: <span className={`font-medium ${quest.difficulty === 'Facile' ? 'text-green-600 dark:text-green-400' : quest.difficulty === 'Moyen' ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400'}`}>{quest.difficulty}</span></p>
              </div>
              <div className="bg-accent text-white rounded-full py-1 px-3 text-sm font-semibold">
                {`Niveau recommandé: ${quest.id}`}
              </div>
            </div>
            
            <p className="mt-4 text-gray-700 dark:text-gray-300">{quest.description}</p>
            
            <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Ennemi à affronter</h3>
              <div className="flex items-center">
                <div className="bg-red-100 dark:bg-red-900 p-2 rounded-full mr-3">
                  <svg className="h-6 w-6 text-red-600 dark:text-red-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">{quest.monster}</p>
                  <div className="flex space-x-4 mt-1">
                    <span className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <svg className="h-4 w-4 mr-1 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                      </svg>
                      {quest.monsterHealth} PV
                    </span>
                    <span className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <svg className="h-4 w-4 mr-1 text-orange-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                      </svg>
                      {quest.monsterAttack} ATQ
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Récompenses</h3>
              <p className="text-gray-700 dark:text-gray-300">{quest.reward}</p>
            </div>
            
            <div className="mt-8 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
              <Link to="/quests" className="btn-secondary w-full sm:w-auto text-center">
                Retour aux quêtes
              </Link>
              <button 
                onClick={handleStartQuest} 
                disabled={starting}
                className="btn-primary w-full sm:w-auto flex justify-center items-center"
              >
                {starting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Préparation...
                  </>
                ) : (
                  'Commencer la quête'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestDetails;
