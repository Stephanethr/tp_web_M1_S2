import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useCharacter from '../hooks/useCharacter';
import useBattle from '../hooks/useBattle';
import BattlePrepare from '../components/battle/BattlePrepare';
import BattleResult from '../components/battle/BattleResult';
import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';
import Button from '../components/common/Button';

function BattlePage() {
  const { characters, loading: charactersLoading, error: charactersError, getCharacters } = useCharacter();
  const { battleResults, loading: battleLoading, error: battleError, startBattle, resetBattle } = useBattle();
  
  const [battleStarted, setBattleStarted] = useState(false);
  const navigate = useNavigate();

  // Charger la liste des personnages
  useEffect(() => {
    getCharacters();
  }, [getCharacters]);

  const handleStartBattle = async (player1Id, player2Id) => {
    setBattleStarted(true);
    await startBattle(player1Id, player2Id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResetBattle = () => {
    resetBattle();
    setBattleStarted(false);
  };

  if (charactersLoading && !battleStarted) {
    return <Loading />;
  }

  if (charactersError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorMessage 
          message="Failed to load characters. Please try again."
          onRetry={getCharacters}
        />
      </div>
    );
  }

  if (characters.length < 2) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                You need at least 2 characters to start a battle.
              </p>
            </div>
          </div>
        </div>
        
        <div className="text-center">
          <p className="mb-4">Would you like to create some characters first?</p>
          <Button 
            variant="primary"
            onClick={() => navigate('/characters/create')}
          >
            Create Characters
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* En-tête de page */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Battle Arena</h1>
        <p className="text-gray-600">
          Pit your champions against each other in epic combat!
        </p>
      </div>
      
      {/* Résultat de bataille */}
      {battleStarted && (
        <div className="mb-8">
          {battleLoading ? (
            <Loading />
          ) : battleError ? (
            <ErrorMessage
              message={battleError}
              onRetry={() => handleResetBattle()}
            />
          ) : battleResults ? (
            <BattleResult 
              result={battleResults} 
              onReset={handleResetBattle} 
            />
          ) : (
            <p className="text-center py-4">Preparing battle...</p>
          )}
        </div>
      )}
      
      {/* Préparation de bataille */}
      {!battleStarted && (
        <BattlePrepare 
          characters={characters} 
          onStartBattle={handleStartBattle}
          disabled={battleLoading} 
        />
      )}
    </div>
  );
}

export default BattlePage;