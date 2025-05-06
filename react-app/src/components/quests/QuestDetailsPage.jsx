import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import questService from '../services/questService';
import {
  ArrowLeftIcon,
  CheckCircleIcon,
  ClockIcon,
  GiftIcon,
  MapIcon,
  ShieldExclamationIcon,
  StarIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const QuestStep = ({ step, questId, isActive, isCompleted, onComplete }) => {
  return (
    <div className={`border rounded-lg p-4 mb-4 ${isCompleted ? 'bg-green-50 border-green-200' : isActive ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'}`}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium">{step.title}</h3>
          <p className="text-sm text-gray-600 mt-1">{step.description}</p>
          {step.location && (
            <div className="flex items-center mt-2 text-sm text-gray-500">
              <MapIcon className="h-4 w-4 mr-1" />
              Localisation: {step.location}
            </div>
          )}
        </div>
        <div>
          {isCompleted ? (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              <CheckCircleIcon className="h-4 w-4 mr-1" /> Complété
            </span>
          ) : isActive ? (
            <button
              onClick={() => onComplete(step.id)}
              className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Marquer comme terminé
            </button>
          ) : (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              <ClockIcon className="h-4 w-4 mr-1" /> En attente
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

const QuestDetailsPage = () => {
  const { questId } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [quest, setQuest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    const fetchQuestDetails = async () => {
      try {
        setLoading(true);
        const response = await questService.getQuestDetails(questId);
        
        if (response.success) {
          setQuest(response.quest);
        } else {
          throw new Error(response.message || "Erreur lors du chargement des détails de la quête");
        }
      } catch (err) {
        console.error("Erreur:", err);
        setError(err.message || "Impossible de charger les détails de la quête");
        
        if (err.response && err.response.status === 404) {
          navigate('/quests');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchQuestDetails();
  }, [questId, currentUser, navigate]);

  const handleAcceptQuest = async () => {
    try {
      const response = await questService.acceptQuest(questId);
      if (response.success) {
        // Mettre à jour l'état local
        setQuest(prevQuest => ({
          ...prevQuest,
          status: 'active',
          current_step: 0
        }));
      } else {
        throw new Error(response.message || "Erreur lors de l'acceptation de la quête");
      }
    } catch (error) {
      console.error("Erreur lors de l'acceptation de la quête:", error);
      setError(error.message || "Impossible d'accepter la quête");
    }
  };

  const handleAbandonQuest = async () => {
    if (window.confirm("Êtes-vous sûr de vouloir abandonner cette quête ? Votre progression sera perdue.")) {
      try {
        const response = await questService.abandonQuest(questId);
        if (response.success) {
          setQuest(prevQuest => ({
            ...prevQuest,
            status: 'available',
            current_step: null,
            completed_steps: []
          }));
        } else {
          throw new Error(response.message || "Erreur lors de l'abandon de la quête");
        }
      } catch (error) {
        console.error("Erreur lors de l'abandon de la quête:", error);
        setError(error.message || "Impossible d'abandonner la quête");
      }
    }
  };

  const handleCompleteStep = async (stepId) => {
    try {
      const response = await questService.completeQuestStep(questId, stepId);
      if (response.success) {
        // Mettre à jour l'état local avec les nouvelles données
        setQuest(response.quest);
        
        // Si la quête est terminée, afficher un message
        if (response.quest.status === 'completed') {
          alert("Félicitations ! Vous avez terminé la quête. Vous pouvez maintenant réclamer votre récompense.");
        }
      } else {
        throw new Error(response.message || "Erreur lors de la complétion de l'étape");
      }
    } catch (error) {
      console.error("Erreur lors de la complétion de l'étape:", error);
      setError(error.message || "Impossible de compléter l'étape");
    }
  };

  const handleClaimReward = async () => {
    try {
      const response = await questService.claimReward(questId);
      if (response.success) {
        setQuest(prevQuest => ({
          ...prevQuest,
          reward_claimed: true
        }));
        
        // Afficher les récompenses obtenues
        alert(`Vous avez reçu: ${response.rewards.join(', ')}`);
      } else {
        throw new Error(response.message || "Erreur lors de la réclamation de la récompense");
      }
    } catch (error) {
      console.error("Erreur lors de la réclamation de la récompense:", error);
      setError(error.message || "Impossible de réclamer la récompense");
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 pt-20">
        <div className="max-w-3xl mx-auto bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <ShieldExclamationIcon className="h-6 w-6 text-red-400" />
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
              <div className="mt-4">
                <Link 
                  to="/quests"
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  <ArrowLeftIcon className="-ml-0.5 mr-2 h-4 w-4" />
                  Retour aux quêtes
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!quest) {
    return (
      <div className="container mx-auto px-4 py-8 pt-20">
        <div className="max-w-3xl mx-auto text-center py-10">
          <p className="text-gray-500">Quête introuvable</p>
          <div className="mt-4">
            <Link 
              to="/quests"
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <ArrowLeftIcon className="-ml-0.5 mr-2 h-4 w-4" />
              Retour aux quêtes
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Style selon la difficulté
  const difficultyStyles = {
    easy: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    hard: 'bg-orange-100 text-orange-800',
    legendary: 'bg-red-100 text-red-800'
  };
  
  const difficultyStyle = difficultyStyles[quest.difficulty.toLowerCase()] || 'bg-gray-100 text-gray-800';

  return (
    <div className="container mx-auto px-4 py-8 pt-20">
      <Helmet>
        <title>{quest.title} | Quêtes | RPG Game</title>
      </Helmet>
      
      <div className="max-w-4xl mx-auto">
        <div className="mb-4">
          <Link 
            to="/quests"
            className="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-700"
          >
            <ArrowLeftIcon className="mr-1 h-4 w-4" />
            Retour aux quêtes
          </Link>
        </div>
        
        {/* En-tête de la quête */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
          {/* Image de la quête (si disponible) */}
          {quest.image_url && (
            <div className="w-full h-48 sm:h-64 md:h-80 bg-gray-200">
              <img 
                src={quest.image_url} 
                alt={quest.title} 
                className="w-full h-full object-cover"
                onError={(e) => {e.target.src = '/images/quest-placeholder.jpg'}}
              />
            </div>
          )}
          
          <div className="p-6">
            <div className="flex flex-wrap justify-between items-start gap-4">
              {/* Titre et informations */}
              <div className="flex-grow">
                <h1 className="text-2xl font-bold text-gray-900">{quest.title}</h1>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <span className="text-sm text-gray-500">
                    Niveau recommandé: {quest.level}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${difficultyStyle}`}>
                    {quest.difficulty}
                  </span>
                  <div className="flex items-center text-amber-500">
                    {Array(quest.reward_rating || 1).fill().map((_, i) => (
                      <StarIcon key={i} className="h-4 w-4" />
                    ))}
                  </div>
                </div>
                
                {/* Indicateur de statut */}
                <div className="mt-3">
                  {quest.status === 'completed' ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <CheckCircleIcon className="h-4 w-4 mr-1" /> Terminée
                    </span>
                  ) : quest.status === 'active' ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      <ClockIcon className="h-4 w-4 mr-1" /> En cours
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      <ClockIcon className="h-4 w-4 mr-1" /> Disponible
                    </span>
                  )}
                </div>
                
                {/* Boutons d'action */}
                <div className="mt-4 flex flex-wrap gap-3">
                  {quest.status === 'available' && (
                    <button
                      onClick={handleAcceptQuest}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      Accepter la quête
                    </button>
                  )}
                  
                  {quest.status === 'active' && (
                    <button
                      onClick={handleAbandonQuest}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      <XMarkIcon className="mr-2 h-5 w-5" />
                      Abandonner
                    </button>
                  )}
                  
                  {quest.status === 'completed' && !quest.reward_claimed && (
                    <button
                      onClick={handleClaimReward}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-amber-700 bg-amber-100 hover:bg-amber-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
                    >
                      <GiftIcon className="mr-2 h-5 w-5" />
                      Réclamer récompense
                    </button>
                  )}
                </div>
              </div>
              
              {/* Récompenses */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-900">Récompenses</h3>
                <ul className="mt-2 space-y-1">
                  {quest.xp_reward && (
                    <li className="text-sm text-gray-700 flex items-center">
                      <span className="font-medium">{quest.xp_reward}</span>
                      <span className="ml-1">XP</span>
                    </li>
                  )}
                  {quest.gold_reward && (
                    <li className="text-sm text-gray-700 flex items-center">
                      <span className="font-medium">{quest.gold_reward}</span>
                      <span className="ml-1">Or</span>
                    </li>
                  )}
                  {quest.item_rewards && quest.item_rewards.map((item, index) => (
                    <li key={index} className="text-sm text-gray-700">
                      {item.name} {item.quantity > 1 && `(x${item.quantity})`}
                    </li>
                  ))}
                  {quest.reward_claimed && (
                    <li className="text-sm text-green-600 mt-2 flex items-center">
                      <CheckCircleIcon className="h-4 w-4 mr-1" />
                      Récompense réclamée
                    </li>
                  )}
                </ul>
              </div>
            </div>
            
            {/* Description détaillée */}
            <div className="mt-6 prose prose-sm max-w-none">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Description</h3>
              <p className="text-gray-600">{quest.description}</p>
              
              {quest.lore && (
                <>
                  <h3 className="text-lg font-medium text-gray-900 mt-4 mb-2">Histoire</h3>
                  <div className="italic text-gray-600 bg-gray-50 p-3 rounded border-l-4 border-gray-300">
                    {quest.lore}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        
        {/* Étapes de la quête */}
        {(quest.steps && quest.steps.length > 0) && (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
            <h2 className="text-xl font-medium text-gray-900 mb-4">Objectifs de la quête</h2>
            
            {quest.steps.map((step, index) => {
              const isCompleted = quest.completed_steps && quest.completed_steps.includes(step.id);
              const isActive = quest.status === 'active' && 
                              !isCompleted && 
                              ((quest.current_step !== undefined && quest.current_step === index) || 
                               (index === 0 && !quest.completed_steps?.length));
              
              return (
                <QuestStep 
                  key={step.id}
                  step={step}
                  questId={quest.id}
                  isActive={isActive}
                  isCompleted={isCompleted}
                  onComplete={handleCompleteStep}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestDetailsPage;
