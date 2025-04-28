import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const QuestResult = () => {
  const [result, setResult] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Récupérer le résultat depuis sessionStorage
    const storedResult = sessionStorage.getItem('questResult');
    if (storedResult) {
      setResult(JSON.parse(storedResult));
    } else {
      // S'il n'y a pas de résultat, rediriger vers la page des quêtes
      navigate('/quests');
    }
  }, [navigate]);

  const handleBackToQuests = () => {
    // Nettoyer le résultat de la session
    sessionStorage.removeItem('questResult');
    navigate('/quests');
  };

  if (!result) {
    return <div className="text-center py-10">Chargement...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="card max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Résultat de la quête</h1>
          <button
            onClick={handleBackToQuests}
            className="btn btn-primary"
          >
            Retour aux quêtes
          </button>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-medium mb-2">
            {result.winner === result.hero.name 
              ? <span className="text-green-600">Victoire !</span>
              : <span className="text-red-600">Défaite...</span>
            }
          </h2>
          
          <div className="flex space-x-10">
            <div>
              <h3 className="font-semibold text-accent">Votre héros</h3>
              <p className="text-lg">{result.hero.name}</p>
              <p>Points de vie initiaux: {result.hero.original_health}</p>
            </div>
            
            <div>
              <h3 className="font-semibold text-red-500">Le monstre</h3>
              <p className="text-lg">{result.monster.name}</p>
              <p>Points de vie initiaux: {result.monster.original_health}</p>
            </div>
          </div>
        </div>

        <h3 className="text-lg font-semibold mb-4">Déroulement du combat</h3>
        
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 max-h-96 overflow-y-auto">
          {result.rounds.map((round, index) => (
            <div 
              key={index} 
              className={`mb-4 p-3 rounded-lg ${
                round.winner ? 'bg-yellow-100 dark:bg-yellow-900' : 'bg-white dark:bg-gray-700'
              }`}
            >
              <h4 className="font-semibold">Round {round.round}</h4>
              
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div>
                  <p className="text-sm">
                    <span className="font-medium text-accent">{result.hero.name}:</span> 
                    {round.hero_health} PV
                  </p>
                  {round.damage_to_monster && (
                    <p className="text-sm text-green-600">
                      Inflige {round.damage_to_monster} points de dégâts
                    </p>
                  )}
                </div>
                
                <div>
                  <p className="text-sm">
                    <span className="font-medium text-red-500">{result.monster.name}:</span> 
                    {round.monster_health} PV
                  </p>
                  {round.damage_to_hero && (
                    <p className="text-sm text-red-600">
                      Inflige {round.damage_to_hero} points de dégâts
                    </p>
                  )}
                </div>
              </div>
              
              {round.winner && (
                <p className="mt-2 font-medium text-center">
                  {round.winner === result.hero.name
                    ? `${result.hero.name} a vaincu ${result.monster.name}!`
                    : `${result.monster.name} a vaincu ${result.hero.name}...`
                  }
                </p>
              )}
            </div>
          ))}
        </div>
        
        {result.winner === result.hero.name && (
          <div className="mt-6 bg-green-50 dark:bg-green-900 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Récompenses</h3>
            <ul className="list-disc list-inside">
              <li>{result.rewards.xp} points d'expérience</li>
              {result.rewards.gold && <li>{result.rewards.gold} pièces d'or</li>}
              {result.rewards.items && result.rewards.items.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestResult;