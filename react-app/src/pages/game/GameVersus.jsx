import React, { useEffect, useState } from 'react';
import { useVersus } from '../../context/VersusContext';

// Composant pour afficher le résultat d'un combat
const BattleResult = ({ battle }) => {
  if (!battle) return null;

  return (
    <div className="battle-result mt-4 p-4 bg-light rounded shadow">
      <h3 className="text-center mb-4">Résultat du combat</h3>
      
      <div className="competitors mb-4">
        <div className="row align-items-center">
          <div className="col text-center">
            <h4>{battle.players.player1.name}</h4>
            <div className="health-bar">
              PV: {battle.players.player1.original_health}
            </div>
          </div>
          <div className="col-2 text-center">
            <span className="vs-badge">VS</span>
          </div>
          <div className="col text-center">
            <h4>{battle.players.player2.name}</h4>
            <div className="health-bar">
              PV: {battle.players.player2.original_health}
            </div>
          </div>
        </div>
      </div>

      <div className="battle-rounds">
        <h4>Déroulement du combat</h4>
        {battle.rounds.map((round, index) => (
          <div key={index} className="round mb-3 p-3 border rounded">
            <h5>Round {round.round}</h5>
            <p><strong>Initiative</strong>: {round.initiative}</p>
            <div className="row">
              <div className="col">
                <p>
                  <strong>{battle.players.player1.name}</strong>: {round.player1_health} PV 
                  {round.damage_to_player1 > 0 && <span className="text-danger"> (-{round.damage_to_player1})</span>}
                </p>
              </div>
              <div className="col">
                <p>
                  <strong>{battle.players.player2.name}</strong>: {round.player2_health} PV 
                  {round.damage_to_player2 > 0 && <span className="text-danger"> (-{round.damage_to_player2})</span>}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="winner text-center mt-4">
        <h3 className="winner-caption">Vainqueur</h3>
        <div className="winner-name display-4">{battle.winner}</div>
      </div>

      <div className="text-center mt-4">
        <button className="btn btn-primary" onClick={() => window.location.reload()}>
          Nouveau combat
        </button>
      </div>
    </div>
  );
};

const GameVersus = () => {
  const {
    isLoading,
    error,
    characters,
    currentBattle,
    fetchAvailableCharacters,
    startBattle
  } = useVersus();

  const [selectedAttacker, setSelectedAttacker] = useState(null);
  const [selectedDefender, setSelectedDefender] = useState(null);

  useEffect(() => {
    fetchAvailableCharacters();
  }, [fetchAvailableCharacters]);

  const handleStartBattle = async () => {
    if (!selectedAttacker || !selectedDefender) return;
    await startBattle(selectedAttacker.id, selectedDefender.id);
  };

  return (
    <div className="game-versus-container">
      <h1 className="text-center mb-4">Mode Versus</h1>
      
      {error && <div className="alert alert-danger">{error}</div>}

      {!currentBattle ? (
        <>
          <div className="versus-grid row">
            {/* Sélection Attaquant */}
            <div className="selection-section col-md-6 mb-4">
              <h2 className="mb-3">Choisissez votre combattant</h2>
              <div className="characters-grid">
                {characters.map((char) => (
                  <div
                    key={char.id}
                    className={`character-card p-3 mb-3 rounded border ${selectedAttacker?.id === char.id ? 'border-primary bg-light' : ''}`}
                    onClick={() => setSelectedAttacker(char)}
                  >
                    <h3>{char.name}</h3>
                    <div className="character-stats">
                      <p className="mb-1">Niveau {char.level}</p>
                      <p className="mb-1">PV: {char.health}</p>
                      <p className="mb-1">ATT: {char.attack || char.strength}</p>
                      <p className="mb-0">DEF: {char.defense}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sélection Défenseur */}
            <div className="selection-section col-md-6 mb-4">
              <h2 className="mb-3">Choisissez votre adversaire</h2>
              <div className="characters-grid">
                {characters.map((char) => (
                  <div
                    key={char.id}
                    className={`character-card p-3 mb-3 rounded border ${selectedDefender?.id === char.id ? 'border-primary bg-light' : ''}`}
                    onClick={() => setSelectedDefender(char)}
                  >
                    <h3>{char.name}</h3>
                    <div className="character-stats">
                      <p className="mb-1">Niveau {char.level}</p>
                      <p className="mb-1">PV: {char.health}</p>
                      <p className="mb-1">ATT: {char.attack || char.strength}</p>
                      <p className="mb-0">DEF: {char.defense}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="text-center mt-3 mb-5">
            <button
              onClick={handleStartBattle}
              disabled={!selectedAttacker || !selectedDefender || isLoading}
              className="btn btn-lg btn-danger battle-button px-5 py-3"
            >
              {isLoading ? 'Chargement...' : '⚔️ Lancer le combat ! ⚔️'}
            </button>
          </div>
        </>
      ) : (
        <BattleResult battle={currentBattle} />
      )}
    </div>
  );
};

export default GameVersus;