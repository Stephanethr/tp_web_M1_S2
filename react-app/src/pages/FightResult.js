import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const FightResult = () => {
  const [result, setResult] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedResult = sessionStorage.getItem('fightResult');
    if (storedResult) {
      setResult(JSON.parse(storedResult));
    } else {
      navigate('/versus');
    }
  }, [navigate]);

  const handleBackToVersus = () => {
    sessionStorage.removeItem('fightResult');
    navigate('/versus');
  };

  if (!result) {
    return <div className="text-center py-10">Chargement...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="card max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Résultat du Combat PVP</h1>
          <button
            onClick={handleBackToVersus}
            className="btn btn-primary"
          >
            Retour au mode Versus
          </button>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-medium mb-4">
            <span className="text-yellow-600">Vainqueur : {result.winner}</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-600">{result.players.player1.name}</h3>
              <p>Points de vie initiaux: {result.players.player1.original_health}</p>
            </div>
            
            <div className="bg-red-50 dark:bg-red-900 p-4 rounded-lg">
              <h3 className="font-semibold text-red-600">{result.players.player2.name}</h3>
              <p>Points de vie initiaux: {result.players.player2.original_health}</p>
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
              <p className="text-sm italic">
                Initiative: <span className="font-medium">{round.initiative}</span>
              </p>
              
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div>
                  <p className="text-sm">
                    <span className="font-medium text-blue-600">{result.players.player1.name}:</span> 
                    {round.player1_health} PV
                  </p>
                  {round.damage_to_player1 !== undefined && (
                    <p className="text-sm text-red-600">
                      Reçoit {round.damage_to_player1} points de dégâts
                    </p>
                  )}
                </div>
                
                <div>
                  <p className="text-sm">
                    <span className="font-medium text-red-600">{result.players.player2.name}:</span> 
                    {round.player2_health} PV
                  </p>
                  {round.damage_to_player2 !== undefined && (
                    <p className="text-sm text-red-600">
                      Reçoit {round.damage_to_player2} points de dégâts
                    </p>
                  )}
                </div>
              </div>
              
              {round.winner && (
                <p className="mt-2 font-medium text-center">
                  {round.winner} remporte le combat !
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FightResult;
