import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useCharacter from '../hooks/useCharacter';
import useQuests from '../hooks/useQuests';
import QuestsList from '../components/quests/QuestsList';
import CombatResult from '../components/quests/CombatResult';
import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';
import CharacterInfoCard from '../components/character/CharacterInfoCard';

function QuestsPage() {
  const { activeCharacter, loading: characterLoading } = useCharacter();
  const { 
    quests, 
    currentQuest, 
    questResults, 
    loading, 
    error, 
    getAvailableQuests, 
    startQuest, 
    resetQuests 
  } = useQuests();
  
  const [questStarted, setQuestStarted] = useState(false);
  const navigate = useNavigate();

  // Vérifier si un personnage est actif
  useEffect(() => {
    if (!characterLoading && !activeCharacter) {
      navigate('/characters');
    }
  }, [activeCharacter, characterLoading, navigate]);

  // Charger la liste des quêtes disponibles
  useEffect(() => {
    if (activeCharacter) {
      getAvailableQuests();
    }
  }, [activeCharacter, getAvailableQuests]);

  const handleStartQuest = async (questId) => {
    setQuestStarted(true);
    await startQuest(questId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResetQuest = () => {
    resetQuests();
    setQuestStarted(false);
  };

  if (characterLoading || loading && !questStarted) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorMessage 
          message={error}
          onRetry={getAvailableQuests}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {activeCharacter && (
        <div className="mb-6">
          <CharacterInfoCard character={activeCharacter} />
        </div>
      )}

      {/* Résultat de quête et combat */}
      {questStarted && questResults && (
        <div className="mb-8">
          {loading ? (
            <Loading />
          ) : (
            <>
              <h2 className="text-2xl font-bold mb-4">
                Quest: {currentQuest?.title}
              </h2>
              <CombatResult 
                result={questResults} 
                onReset={handleResetQuest}
              />
            </>
          )}
        </div>
      )}

      {/* Liste des quêtes disponibles */}
      {!questStarted && (
        <>
          <div className="mb-6">
            <h1 className="text-2xl font-bold mb-2">Available Quests</h1>
            <p className="text-gray-600">
              Choose your adventure and test your combat skills!
            </p>
          </div>

          <QuestsList 
            quests={quests} 
            onStartQuest={handleStartQuest}
            loading={loading}
          />
        </>
      )}
    </div>
  );
}

export default QuestsPage;