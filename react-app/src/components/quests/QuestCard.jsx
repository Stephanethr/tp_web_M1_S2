import React from 'react';
import Button from '../common/Button';

function QuestCard({ quest, onStartQuest, disabled }) {
  // Fonction pour déterminer le badge de difficulté
  const getDifficultyBadge = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return (
          <span className="px-2 py-1 text-xs font-bold rounded-full bg-green-100 text-green-800">
            Easy
          </span>
        );
      case 'medium':
        return (
          <span className="px-2 py-1 text-xs font-bold rounded-full bg-yellow-100 text-yellow-800">
            Medium
          </span>
        );
      case 'hard':
        return (
          <span className="px-2 py-1 text-xs font-bold rounded-full bg-red-100 text-red-800">
            Hard
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 text-xs font-bold rounded-full bg-gray-100 text-gray-800">
            {difficulty}
          </span>
        );
    }
  };

  return (
    <div className={`rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:transform hover:scale-105 ${quest.background || 'bg-indigo-600'}`}>
      <div className="p-6 text-white">
        <div className="flex justify-between items-start">
          <h3 className="text-xl font-bold mb-2">{quest.title}</h3>
          {getDifficultyBadge(quest.difficulty)}
        </div>
        
        <p className="mb-4 opacity-90">{quest.description}</p>
        
        <div className="mb-4 p-3 bg-black bg-opacity-25 rounded-lg">
          <h4 className="font-semibold mb-1">You'll face:</h4>
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold">{quest.monster.name}</span>
            <div className="flex space-x-3">
              <div className="flex items-center">
                <span role="img" aria-label="health" className="mr-1">❤️</span>
                <span>{quest.monster.health}</span>
              </div>
              <div className="flex items-center">
                <span role="img" aria-label="attack" className="mr-1">⚔️</span>
                <span>{quest.monster.attack}</span>
              </div>
              <div className="flex items-center">
                <span role="img" aria-label="level" className="mr-1">⭐</span>
                <span>Lvl {quest.monster.level}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mb-4">
          <h4 className="font-semibold mb-1">Rewards:</h4>
          <p>{quest.reward}</p>
        </div>
        
        <Button 
          variant="light" 
          fullWidth 
          onClick={() => onStartQuest(quest.id)}
          disabled={disabled}
        >
          Embark on Quest
        </Button>
      </div>
    </div>
  );
}

export default QuestCard;