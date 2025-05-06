import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import questService from '../../services/questService';
import QuestCard from './QuestCard';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';
import LoadingSpinner from '../ui/LoadingSpinner';

const QuestsList = ({ type = 'available', filters }) => {
  const navigate = useNavigate();
  const [quests, setQuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Récupérer les quêtes selon le type et les filtres
  useEffect(() => {
    const fetchQuests = async () => {
      setLoading(true);
      try {
        let response;
        
        if (type === 'active') {
          response = await questService.getActiveQuests();
        } else if (type === 'completed') {
          response = await questService.getCompletedQuests();
        } else {
          // Par défaut, récupérer toutes les quêtes disponibles
          response = await questService.getQuests();
        }
        
        if (response.success) {
          let filteredQuests = response.quests || [];
          
          // Appliquer les filtres client-side
          if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            filteredQuests = filteredQuests.filter(quest => 
              quest.title.toLowerCase().includes(searchLower) || 
              quest.description.toLowerCase().includes(searchLower)
            );
          }
          
          if (filters.difficulty) {
            filteredQuests = filteredQuests.filter(quest => 
              quest.difficulty.toLowerCase() === filters.difficulty.toLowerCase()
            );
          }
          
          // Trier les quêtes
          if (filters.sort) {
            const [sortBy, order] = filters.sort.split('_');
            filteredQuests = filteredQuests.sort((a, b) => {
              if (sortBy === 'level') {
                return order === 'asc' ? a.level - b.level : b.level - a.level;
              } else if (sortBy === 'title') {
                return order === 'asc' 
                  ? a.title.localeCompare(b.title) 
                  : b.title.localeCompare(a.title);
              }
              return 0;
            });
          }
          
          setQuests(filteredQuests);
        } else {
          throw new Error(response.message || "Erreur lors du chargement des quêtes");
        }
      } catch (err) {
        console.error("Erreur lors du chargement des quêtes:", err);
        setError(err.message || "Impossible de charger les quêtes.");
        
        // Rediriger vers la création/sélection de personnage si nécessaire
        if (err.response && err.response.status === 400) {
          navigate('/characters');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchQuests();
  }, [type, filters, navigate]);

  // Gérer l'acceptation d'une quête
  const handleAcceptQuest = async (questId) => {
    try {
      const response = await questService.acceptQuest(questId);
      if (response.success) {
        // Rediriger vers les quêtes actives
        navigate('/quests', { state: { activeTab: 'active' } });
      } else {
        throw new Error(response.message || "Erreur lors de l'acceptation de la quête");
      }
    } catch (error) {
      console.error("Erreur lors de l'acceptation de la quête:", error);
      setError(error.message || "Impossible d'accepter la quête.");
    }
  };

  // Gérer l'abandon d'une quête
  const handleAbandonQuest = async (questId) => {
    if (window.confirm("Êtes-vous sûr de vouloir abandonner cette quête ?")) {
      try {
        const response = await questService.abandonQuest(questId);
        if (response.success) {
          // Rafraîchir la liste des quêtes
          const updatedQuests = quests.filter(q => q.id !== questId);
          setQuests(updatedQuests);
        } else {
          throw new Error(response.message || "Erreur lors de l'abandon de la quête");
        }
      } catch (error) {
        console.error("Erreur lors de l'abandon de la quête:", error);
        setError(error.message || "Impossible d'abandonner la quête.");
      }
    }
  };

  // Gérer la réclamation de récompense
  const handleClaimReward = async (questId) => {
    try {
      const response = await questService.claimReward(questId);
      if (response.success) {
        // Rafraîchir la liste des quêtes
        const updatedQuests = quests.map(q => 
          q.id === questId ? { ...q, reward_claimed: true } : q
        );
        setQuests(updatedQuests);
        
        // Afficher un message avec les récompenses obtenues
        alert(`Vous avez reçu: ${response.rewards.join(', ')}`);
      } else {
        throw new Error(response.message || "Erreur lors de la réclamation de la récompense");
      }
    } catch (error) {
      console.error("Erreur lors de la réclamation de la récompense:", error);
      setError(error.message || "Impossible de réclamer la récompense.");
    }
  };

  // Afficher un message si un personnage n'est pas sélectionné
  if (error && error.includes('sélectionner un personnage')) {
    return (
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <ExclamationCircleIcon className="h-5 w-5 text-yellow-400" aria-hidden="true" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              Vous devez d'abord sélectionner un personnage pour accéder aux quêtes.
            </p>
            <div className="mt-4">
              <button
                onClick={() => navigate('/characters')}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Voir mes personnages
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Afficher un spinner pendant le chargement
  if (loading) {
    return <LoadingSpinner />;
  }

  // Afficher un message d'erreur générique
  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <ExclamationCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  // Afficher un message si aucune quête n'est disponible
  if (quests.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">
          {type === 'active' 
            ? "Vous n'avez aucune quête en cours." 
            : type === 'completed' 
              ? "Vous n'avez complété aucune quête." 
              : "Aucune quête disponible."}
        </p>
        {type === 'active' && (
          <button
            onClick={() => navigate('/quests', { state: { activeTab: 'available' } })}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
          >
            Découvrir des quêtes
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {quests.map(quest => (
        <QuestCard 
          key={quest.id}
          quest={quest}
          type={type}
          onAccept={() => handleAcceptQuest(quest.id)}
          onAbandon={() => handleAbandonQuest(quest.id)}
          onClaimReward={() => handleClaimReward(quest.id)}
          onViewDetails={() => navigate(`/quests/${quest.id}`)}
        />
      ))}
    </div>
  );
};

export default QuestsList;
