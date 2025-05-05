import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const HomePage = () => {
  const { currentUser } = useAuth();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Bienvenue dans notre univers RPG</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Plongez dans un monde de fantasy, créez votre héros et partez à l'aventure !
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-primary-700 mb-4">Choisissez votre classe</h2>
          <h2 className="text-2xl font-bold text-primary-700 mb-4">Choisissez votre classe</h2>
          <p className="text-gray-600 mb-4">Guerrier courageux ou mage puissant ? Choisissez votre voie et développez vos compétences uniques.</p>
          {currentUser ? (
            <Link to="/characters" className="inline-block mt-2 px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700">
              Créer un personnage
            </Link>
          ) : (
            <Link to="/login" className="inline-block mt-2 px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700">
              Se connecter
            </Link>
          )}
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-primary-700 mb-4">Explorez des quêtes</h2>
          <p className="text-gray-600 mb-4">Partez à l'aventure, combattez des monstres et accomplissez des quêtes épiques à travers les terres mythiques.</p>
          {currentUser ? (
            <Link to="/quests" className="inline-block mt-2 px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700">
              Voir les quêtes
            </Link>
          ) : (
            <Link to="/register" className="inline-block mt-2 px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700">
              S'inscrire
            </Link>
          )}
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-primary-700 mb-4">Collectionnez des objets</h2>
          <p className="text-gray-600 mb-4">Trouvez des équipements rares, des potions magiques et des ressources précieuses pour améliorer votre personnage.</p>
          {currentUser ? (
            <Link to="/inventory" className="inline-block mt-2 px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700">
              Voir l'inventaire
            </Link>
          ) : (
            <Link to="/about" className="inline-block mt-2 px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700">
              En savoir plus
            </Link>
          )}
        </div>
      </div>
      
      {currentUser ? (
        <div className="bg-primary-50 p-6 rounded-lg shadow border border-primary-200">
          <h2 className="text-2xl font-bold text-primary-800 mb-4">Bienvenue, {currentUser.user_login}!</h2>
          <p className="text-gray-700 mb-4">
            Votre aventure vous attend. Que souhaitez-vous faire aujourd'hui?
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/characters" className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700">
              Mes personnages
            </Link>
            <Link to="/quests" className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700">
              Quêtes disponibles
            </Link>
            <Link to="/inventory" className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700">
              Mon inventaire
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-gray-100 p-6 rounded-lg shadow text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Rejoignez l'aventure</h2>
          <p className="text-gray-600 mb-6">Créez un compte gratuitement et commencez votre quête dès aujourd'hui !</p>
          <div className="space-x-4">
            <Link to="/login" className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 shadow-md">
              Se connecter
            </Link>
            <Link to="/register" className="px-6 py-3 bg-white text-primary-700 border border-primary-600 rounded-lg hover:bg-gray-50 shadow-md">
              S'inscrire
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;

