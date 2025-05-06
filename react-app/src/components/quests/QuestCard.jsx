import React from 'react';
import {
  ClockIcon,
  StarIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  XMarkIcon,
  GiftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';

// Styles pour les difficultés de quête
const DIFFICULTY_STYLES = {
  easy: {
    bg: 'bg-green-100',
    text: 'text-green-800',
    border: 'border-green-200'
  },
  medium: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-800',
    border: 'border-yellow-200'
  },
  hard: {
    bg: 'bg-orange-100',
    text: 'text-orange-800',
    border: 'border-orange-200'
  },
  legendary: {
    bg: 'bg-red-100',
    text: 'text-red-800',
    border: 'border-red-200'
  }
};

const getDifficultyStyle = (difficulty) => {
  return DIFFICULTY_STYLES[difficulty.toLowerCase()] || DIFFICULTY_STYLES.medium;
};

// Composant de progression
const QuestProgress = ({ progress, totalSteps }) => {
  const percentage = Math.round((progress / totalSteps) * 100);
  
  return (
    <div className="mt-2">
      <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
        <span>Progression</span>
        <span>{percentage}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div 
          className="bg-primary-600 h-2.5 rounded-full" 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

const QuestCard = ({ quest, type, onAccept, onAbandon, onClaimReward, onViewDetails }) => {
  const difficultyStyle = getDifficultyStyle(quest.difficulty);
  
  return (
    <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="flex flex-col md:flex-row">
        {/* Image de quête (si disponible) */}
        {quest.image_url && (
          <div className="w-full md:w-1/4 bg-gray-200">
            <img 
              src={quest.image_url} 
              alt={quest.title} 
              className="w-full h-full object-cover"
              onError={(e) => {e.target.src = '/images/quest-placeholder.jpg'}}
            />
          </div>
        )}
        
        {/* Contenu de la quête */}
        <div className="flex-grow p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-medium text-gray-900">{quest.title}</h3>
              <div className="flex items-center mt-1 space-x-2">
                <span className="text-sm text-gray-500">Niveau {quest.level}</span>
                <span className={`text-xs ${difficultyStyle.bg} ${difficultyStyle.text} px-2 py-0.5 rounded-full`}>
                  {quest.difficulty}
                </span>
              </div>
            </div>
            
            {/* Récompenses */}
            <div className="flex flex-col items-end">
              <div className="flex items-center space-x-1 text-amber-500">
                {Array(quest.reward_rating || 1).fill().map((_, i) => (
                  <StarIcon key={i} className="h-4 w-4" />
                ))}
              </div>
              <div className="text-sm text-gray-600 mt-1">
                {quest.xp_reward && <div>{quest.xp_reward} XP</div>}
                {quest.gold_reward && <div>{quest.gold_reward} Or</div>}
              </div>
            </div>
          </div>
          
          <p className="mt-2 text-sm text-gray-600 line-clamp-2">{quest.description}</p>
          
          {/* Afficher la progression pour les quêtes actives */}
          {type === 'active' && quest.steps && (
            <QuestProgress 
              progress={quest.completed_steps || 0} 
              totalSteps={quest.steps.length} 
            />
          )}
          
          {/* Actions selon l'état de la quête */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center text-sm text-gray-500">
              {type === 'active' ? (
                <div className="flex items-center">
                  <ClockIcon className="h-4 w-4 mr-1" />
                  Quête en cours
                </div>
              ) : type === 'completed' ? (
                <div className="flex items-center text-green-600">
                  <CheckCircleIcon className="h-4 w-4 mr-1" />
                  Complétée {quest.completed_date && `le ${new Date(quest.completed_date).toLocaleDateString()}`}
                </div>
              ) : (
                <div className="flex items-center">
                  <ClockIcon className="h-4 w-4 mr-1" />
                  Disponible
                </div>
              )}
            </div>
            
            <div className="flex flex-wrap gap-2">
              {/* Actions pour les quêtes disponibles */}
              {type === 'available' && (
                <button
                  onClick={onAccept}
                  className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Accepter la quête
                </button>
              )}
              
              {/* Actions pour les quêtes actives */}
              {type === 'active' && (
                <>
                  <button
                    onClick={onAbandon}
                    className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <XMarkIcon className="h-4 w-4 mr-1" />
                    Abandonner
                  </button>
                </>
              )}
              
              {/* Actions pour les quêtes complétées */}
              {type === 'completed' && !quest.reward_claimed && (
                <button
                  onClick={onClaimReward}
                  className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-amber-700 bg-amber-100 hover:bg-amber-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
                >
                  <GiftIcon className="h-4 w-4 mr-1" />
                  Réclamer récompense
                </button>
              )}
              
              {/* Bouton de détails commun à tous les types */}
              <button
                onClick={onViewDetails}
                className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Détails
                <ChevronRightIcon className="ml-1 h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestCard;
