import React, { useState } from 'react';
import CharacterSelector from './CharacterSelector';
import Button from '../common/Button';

function BattlePrepare({ characters, onStartBattle, disabled }) {
  const [player1Id, setPlayer1Id] = useState(null);
  const [player2Id, setPlayer2Id] = useState(null);

  const handleStartBattle = () => {
    if (player1Id && player2Id) {
      onStartBattle(player1Id, player2Id);
    }
  };

  // Obtenir les objets de personnage basés sur les IDs
  const player1 = characters.find(char => char.id === player1Id);
  const player2 = characters.find(char => char.id === player2Id);

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-6">Select Your Fighters</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Sélection du joueur 1 */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Player 1</h3>
              {player1 && (
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
                  {player1.name} selected
                </span>
              )}
            </div>
            <CharacterSelector 
              characters={characters}
              selectedId={player1Id}
              onSelect={setPlayer1Id}
            />
          </div>
          
          {/* Sélection du joueur 2 */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Player 2</h3>
              {player2 && (
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
                  {player2.name} selected
                </span>
              )}
            </div>
            <CharacterSelector 
              characters={characters}
              selectedId={player2Id}
              onSelect={setPlayer2Id}
            />
          </div>
        </div>
      </div>

      {/* Comparaison des combattants et bouton de démarrage */}
      {player1 && player2 && (
        <div className="bg-gray-50 p-6 rounded-lg border shadow-sm">
          <h3 className="text-xl font-bold text-center mb-4">Battle Preview</h3>
          
          <div className="flex justify-center items-center space-x-8 mb-6">
            <div className="text-center">
              <div className="text-lg font-bold">{player1.name}</div>
              <div className="text-sm text-gray-600">{player1.character_type} ({player1.race})</div>
            </div>
            
            <div className="text-2xl font-bold text-red-600">VS</div>
            
            <div className="text-center">
              <div className="text-lg font-bold">{player2.name}</div>
              <div className="text-sm text-gray-600">{player2.character_type} ({player2.race})</div>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-2 mb-6">
            <div className="col-span-1"></div>
            <div className="text-center font-semibold">{player1.name}</div>
            <div className="text-center font-semibold">{player2.name}</div>
            
            <div className="font-semibold">Health</div>
            <div className="text-center">{player1.health}</div>
            <div className="text-center">{player2.health}</div>
            
            <div className="font-semibold">Attack</div>
            <div className="text-center">{player1.attack}</div>
            <div className="text-center">{player2.attack}</div>
            
            <div className="font-semibold">Defense</div>
            <div className="text-center">{player1.defense}</div>
            <div className="text-center">{player2.defense}</div>
          </div>
          
          <div className="text-center">
            <Button 
              variant="primary" 
              size="lg"
              onClick={handleStartBattle}
              disabled={disabled}
            >
              Start Battle
            </Button>
            <p className="text-sm text-gray-500 mt-2">
              Note: Combat is simulated and no characters will be permanently harmed.
            </p>
          </div>
        </div>
      )}

      {/* Instructions si aucun combattant n'est sélectionné */}
      {(!player1 || !player2) && (
        <div className="text-center p-6 bg-blue-50 rounded-lg">
          <p className="text-blue-800">
            {!player1 && !player2 
              ? "Select two characters to start the battle!"
              : !player1 
                ? "Select a character for Player 1"
                : "Select a character for Player 2"
            }
          </p>
        </div>
      )}
    </div>
  );
}

export default BattlePrepare;