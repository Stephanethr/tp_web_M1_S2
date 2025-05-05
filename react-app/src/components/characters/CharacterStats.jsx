import React from 'react';
import { 
  HeartIcon, 
  ShieldCheckIcon,
  BoltIcon,
  SparklesIcon,
  ArrowUpIcon
} from '@heroicons/react/24/solid';

const CharacterStats = ({ character, stats }) => {
  if (!character) return null;
  
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="bg-primary-700 p-4 text-white">
        <h3 className="font-bold text-lg">Statistiques</h3>
      </div>
      
      <div className="p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-3 bg-red-50 p-3 rounded-lg">
            <HeartIcon className="h-6 w-6 text-red-500" />
            <div>
              <div className="text-xs text-red-700 uppercase font-semibold">Santé</div>
              <div className="text-lg font-bold text-gray-900">{character.health}</div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 bg-orange-50 p-3 rounded-lg">
            <BoltIcon className="h-6 w-6 text-orange-500" />
            <div>
              <div className="text-xs text-orange-700 uppercase font-semibold">Attaque</div>
              <div className="text-lg font-bold text-gray-900">{character.attack}</div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 bg-blue-50 p-3 rounded-lg">
            <ShieldCheckIcon className="h-6 w-6 text-blue-500" />
            <div>
              <div className="text-xs text-blue-700 uppercase font-semibold">Défense</div>
              <div className="text-lg font-bold text-gray-900">{character.defense}</div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 bg-purple-50 p-3 rounded-lg">
            <SparklesIcon className="h-6 w-6 text-purple-500" />
            <div>
              <div className="text-xs text-purple-700 uppercase font-semibold">Niveau</div>
              <div className="text-lg font-bold text-gray-900">{character.level}</div>
            </div>
          </div>
        </div>

        {stats && (
          <>
            <hr />
            <div className="space-y-3">
              <h4 className="font-medium text-gray-600">Statistiques de jeu</h4>
              
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Combats gagnés:</span>
                  <span className="font-medium">{stats.battles_won}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Combats perdus:</span>
                  <span className="font-medium">{stats.battles_lost}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Monstres vaincus:</span>
                  <span className="font-medium">{stats.monsters_defeated}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Quêtes complétées:</span>
                  <span className="font-medium">{stats.quests_completed}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Objets collectés:</span>
                  <span className="font-medium">{stats.items_collected}</span>
                </div>
              </div>
            </div>

            {/* Progress bar for experience */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-700">Expérience</span>
                <div className="flex items-center text-primary-700">
                  <span>{character.experience}/{character.level * 100}</span>
                  <ArrowUpIcon className="h-4 w-4 ml-1" />
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-primary-600 h-2.5 rounded-full" 
                  style={{ width: `${Math.min(100, (character.experience / (character.level * 100)) * 100)}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500">
                {character.level * 100 - character.experience} points d'expérience avant le niveau suivant
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CharacterStats;
