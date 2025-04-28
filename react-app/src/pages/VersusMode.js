import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getVersusMode, startFight } from '../api/apiService';

const VersusMode = () => {
  const [characters, setCharacters] = useState([]);
  const [selectedPlayer1, setSelectedPlayer1] = useState('');
  const [selectedPlayer2, setSelectedPlayer2] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        const data = await getVersusMode();
        if (data.success) {
          setCharacters(data.characters);
        } else {
          setError(data.message);
        }
      } catch (err) {
        setError('Erreur lors du chargement des personnages');
      } finally {
        setLoading(false);
      }
    };

    fetchCharacters();
  }, []);

  const handleStartFight = async (e) => {
    e.preventDefault();
    
    if (!selectedPlayer1 || !selectedPlayer2) {
      setError('Veuillez sélectionner deux personnages pour le combat');
      return;
    }

    if (selectedPlayer1 === selectedPlayer2) {
      setError('Un personnage ne peut pas se battre contre lui-même');
      return;
    }

    setLoading(true);
    try {
      const data = await startFight(selectedPlayer1, selectedPlayer2);
      if (data.success) {
        // Stocker le résultat dans sessionStorage
        sessionStorage.setItem('fightResult', JSON.stringify(data.result));
        navigate('/fight-result');
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Erreur lors du démarrage du combat');
    } finally {
      setLoading(false);
    }
  };

  const getCharacterById = (id) => {
    return characters.find(char => char.id === parseInt(id));
  };

  if (loading && characters.length === 0) {
    return <div className="text-center py-10">Chargement...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Mode Combat (PVP)</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleStartFight} className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Sélection joueur 1 */}
        <div className="card">
          <h2 className="text-xl font-bold mb-4 text-blue-600">Joueur 1</h2>
          
          <div className="mb-4">
            <label htmlFor="player1" className="block text-sm font-medium mb-1">
              Sélectionnez un personnage
            </label>
            <select
              id="player1"
              className="input-field w-full"
              value={selectedPlayer1}
              onChange={(e) => setSelectedPlayer1(e.target.value)}
              required
            >
              <option value="">Sélectionner...</option>
              {characters.map((character) => (
                <option key={character.id} value={character.id}>
                  {character.name} (Niv. {character.level} {character.class})
                </option>
              ))}
            </select>
          </div>

          {selectedPlayer1 && (
            <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
              <h3 className="font-semibold">{getCharacterById(selectedPlayer1).name}</h3>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <p><span className="font-medium">PV:</span> {getCharacterById(selectedPlayer1).health}</p>
                <p><span className="font-medium">Niv:</span> {getCharacterById(selectedPlayer1).level}</p>
                <p><span className="font-medium">ATT:</span> {getCharacterById(selectedPlayer1).attack}</p>
                <p><span className="font-medium">DEF:</span> {getCharacterById(selectedPlayer1).defense}</p>
              </div>
            </div>
          )}
        </div>

        {/* Sélection joueur 2 */}
        <div className="card">
          <h2 className="text-xl font-bold mb-4 text-red-600">Joueur 2</h2>
          
          <div className="mb-4">
            <label htmlFor="player2" className="block text-sm font-medium mb-1">
              Sélectionnez un personnage
            </label>
            <select
              id="player2"
              className="input-field w-full"
              value={selectedPlayer2}
              onChange={(e) => setSelectedPlayer2(e.target.value)}
              required
            >
              <option value="">Sélectionner...</option>
              {characters.map((character) => (
                <option key={character.id} value={character.id}>
                  {character.name} (Niv. {character.level} {character.class})
                </option>
              ))}
            </select>
          </div>

          {selectedPlayer2 && (
            <div className="bg-red-50 dark:bg-red-900 p-4 rounded-lg">
              <h3 className="font-semibold">{getCharacterById(selectedPlayer2).name}</h3>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <p><span className="font-medium">PV:</span> {getCharacterById(selectedPlayer2).health}</p>
                <p><span className="font-medium">Niv:</span> {getCharacterById(selectedPlayer2).level}</p>
                <p><span className="font-medium">ATT:</span> {getCharacterById(selectedPlayer2).attack}</p>
                <p><span className="font-medium">DEF:</span> {getCharacterById(selectedPlayer2).defense}</p>
              </div>
            </div>
          )}
        </div>

        {/* Bouton de démarrage du combat */}
        <div className="md:col-span-2 flex justify-center mt-6">
          <button
            type="submit"
            className="btn btn-primary text-lg px-8 py-3"
            disabled={!selectedPlayer1 || !selectedPlayer2 || selectedPlayer1 === selectedPlayer2 || loading}
          >
            {loading ? 'Chargement...' : 'Lancer le combat !'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default VersusMode;