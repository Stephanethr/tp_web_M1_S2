import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import useCharacter from '../../hooks/useCharacter';
import CharacterCard from './CharacterCard';
import Button from '../common/Button';
import Loading from '../common/Loading';
import ErrorMessage from '../common/ErrorMessage';

function CharacterList() {
  const { characters, loading, error, getCharacters } = useCharacter();

  useEffect(() => {
    getCharacters();
  }, [getCharacters]);

  if (loading) return <Loading />;
  
  if (error) return <ErrorMessage message={error} onRetry={getCharacters} />;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Your Characters</h1>
        <Link to="/characters/create">
          <Button>Create New Character</Button>
        </Link>
      </div>

      {characters.length === 0 ? (
        <div className="bg-white shadow rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold mb-4">No Characters Yet</h2>
          <p className="text-gray-600 mb-4">
            Create your first character to begin your adventure!
          </p>
          <Link to="/characters/create">
            <Button size="lg">Create Character</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {characters.map(character => (
            <CharacterCard key={character.id} character={character} />
          ))}
        </div>
      )}
    </div>
  );
}

export default CharacterList;