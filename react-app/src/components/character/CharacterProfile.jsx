import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useCharacter from '../../hooks/useCharacter';
import Card from '../common/Card';
import Button from '../common/Button';
import Loading from '../common/Loading';
import ErrorMessage from '../common/ErrorMessage';

// Nom des statistiques avec leurs icônes
const STATS = [
  { name: 'Health', icon: '❤️', key: 'health' },
  { name: 'Attack', icon: '⚔️', key: 'attack' },
  { name: 'Defense', icon: '🛡️', key: 'defense' },
  { name: 'Level', icon: '⭐', key: 'level' }
];

function CharacterProfile({ characterId }) {
  const { getCharacterById, selectCharacter, activeCharacter } = useCharacter();
  const [character, setCharacter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCharacter = async () => {
      setLoading(true);
      try {
        const data = await getCharacterById(characterId);
        if (data) {
          setCharacter(data);
        } else {
          setError('Character not found');
        }
      } catch (err) {
        setError(err.message || 'Failed to load character data');
      } finally {
        setLoading(false);
      }
    };

    fetchCharacter();
  }, [characterId, getCharacterById]);

  const handleSelectCharacter = async () => {
    await selectCharacter(characterId);
  };

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;
  if (!character) return <ErrorMessage message="Character not found" />;

  const isActive = activeCharacter && activeCharacter.id === character.id;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to="/characters" className="text-indigo-600 hover:text-indigo-800 flex items-center">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Characters
        </Link>
      </div>

      <Card>
        <div className="flex flex-col md:flex-row">
          {/* Avatar/Icon Section */}
          <div className="md:w-1/3 flex justify-center mb-6 md:mb-0">
            <div className={`flex flex-col items-center justify-center p-6 rounded-xl ${
              character.race === 'human' ? 'bg-blue-100' :
              character.race === 'elf' ? 'bg-green-100' :
              character.race === 'dwarf' ? 'bg-amber-100' :
              character.race === 'orc' ? 'bg-red-100' : 'bg-gray-100'
            }`}>
              <span className="text-6xl mb-2">
                {character.class === 'warrior' ? '⚔️' : '🧙'}
              </span>
              <h1 className="text-2xl font-bold text-gray-800">{character.name}</h1>
              <p className="text-gray-600 capitalize">
                {character.race} {character.class}
              </p>
              {isActive && (
                <span className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Active Character
                </span>
              )}
            </div>
          </div>

          {/* Stats Section */}
          <div className="md:w-2/3 md:pl-8">
            <h2 className="text-xl font-semibold mb-4">Character Stats</h2>
            <div className="grid grid-cols-2 gap-4">
              {STATS.map(stat => (
                <div key={stat.key} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <span className="text-xl mr-2">{stat.icon}</span>
                    <h3 className="font-medium">{stat.name}</h3>
                  </div>
                  <p className="text-2xl font-bold text-gray-800">
                    {character[stat.key]}
                  </p>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              {!isActive && (
                <Button onClick={handleSelectCharacter} fullWidth>
                  Select as Active Character
                </Button>
              )}
              <Link to="/inventory" className="sm:flex-1">
                <Button variant={isActive ? "primary" : "light"} fullWidth>
                  View Inventory
                </Button>
              </Link>
              <Link to="/quests" className="sm:flex-1">
                <Button variant={isActive ? "primary" : "light"} fullWidth>
                  Start Quest
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default CharacterProfile;