import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useCharacter from '../hooks/useCharacter';
import CharacterList from '../components/character/CharacterList';
import CreateCharacterForm from '../components/character/CreateCharacterForm';
import Button from '../components/common/Button';
import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';

function CharactersPage() {
  const { characters, loading, error, getCharacters, createCharacter, selectCharacter } = useCharacter();
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    getCharacters();
  }, [getCharacters]);

  const handleCreateCharacter = async (characterData) => {
    const success = await createCharacter(characterData);
    if (success) {
      setShowCreateForm(false);
      getCharacters();
    }
  };

  const handleSelectCharacter = async (characterId) => {
    await selectCharacter(characterId);
    getCharacters(); // Refresh to update the active character
  };

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Characters</h1>
        <Button onClick={() => setShowCreateForm(!showCreateForm)}>
          {showCreateForm ? 'Cancel' : 'Create New Character'}
        </Button>
      </div>

      {showCreateForm ? (
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Create New Character</h2>
          <CreateCharacterForm onSubmit={handleCreateCharacter} />
        </div>
      ) : null}

      {characters && characters.length > 0 ? (
        <CharacterList 
          characters={characters} 
          onSelectCharacter={handleSelectCharacter} 
        />
      ) : (
        <div className="bg-white shadow rounded-lg p-6 text-center">
          <p className="text-gray-600 mb-4">You don't have any characters yet.</p>
          {!showCreateForm && (
            <Button onClick={() => setShowCreateForm(true)}>Create Your First Character</Button>
          )}
        </div>
      )}
    </div>
  );
}

export default CharactersPage;