import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import CharacterForm from '../components/characters/CharacterForm';
import { ChevronLeftIcon } from '@heroicons/react/24/solid';

const CreateCharacterPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Helmet>
        <title>Créer un Personnage | RPG Game</title>
      </Helmet>
      
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link to="/characters" className="inline-flex items-center text-primary-600 hover:text-primary-800">
            <ChevronLeftIcon className="h-4 w-4 mr-1" />
            Retour à la liste des personnages
          </Link>
        </div>
        
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="bg-primary-600 px-6 py-4">
            <h1 className="text-xl font-bold text-white">Créer un nouveau personnage</h1>
            <p className="text-primary-100 text-sm">Choisissez une race, une classe et nommez votre héros</p>
          </div>
          
          <div className="p-6">
            <CharacterForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateCharacterPage;
