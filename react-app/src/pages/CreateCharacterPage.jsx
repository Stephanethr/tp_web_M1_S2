import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CreateCharacterForm from '../components/character/CreateCharacterForm';
import useCharacter from '../hooks/useCharacter';

function CreateCharacterPage() {
  const { createCharacter } = useCharacter();
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleCreateCharacter = async (characterData) => {
    try {
      const character = await createCharacter(characterData);
      if (character) {
        navigate(`/characters/${character.id}`);
      } else {
        setError('Failed to create character. Please try again.');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while creating your character.');
    }
  };

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

      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Create a New Character</h1>
        <CreateCharacterForm onSubmit={handleCreateCharacter} error={error} />
      </div>
    </div>
  );
}

export default CreateCharacterPage;