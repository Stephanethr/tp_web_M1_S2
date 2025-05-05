import React from 'react';
import { useParams } from 'react-router-dom';
import CharacterProfile from '../components/character/CharacterProfile';
import NotFoundPage from './NotFoundPage';

function CharacterProfilePage() {
  const { id } = useParams();
  
  if (!id) {
    return <NotFoundPage />;
  }

  return <CharacterProfile characterId={id} />;
}

export default CharacterProfilePage;