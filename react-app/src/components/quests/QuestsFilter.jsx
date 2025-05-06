import React from 'react';
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';

const QuestsFilter = ({ filters, onFilterChange }) => {
  const handleSearchChange = (e) => {
    onFilterChange({ search: e.target.value });
  };
  
  const handleDifficultyChange = (e) => {
    onFilterChange({ difficulty: e.target.value });
  };
  
  const handleSortChange = (e) => {
    onFilterChange({ sort: e.target.value });
  };
  
  return (
    <div className="flex flex-col sm:flex-row items-center gap-3">
      {/* Recherche */}
      <div className="relative flex-grow">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={filters.search}
          onChange={handleSearchChange}
          placeholder="Rechercher une quête..."
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
        />
      </div>
      
      {/* Filtre par difficulté */}
      <div className="w-full sm:w-auto">
        <select
          value={filters.difficulty}
          onChange={handleDifficultyChange}
          className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
        >
          <option value="">Toutes difficultés</option>
          <option value="easy">Facile</option>
          <option value="medium">Moyen</option>
          <option value="hard">Difficile</option>
          <option value="legendary">Légendaire</option>
        </select>
      </div>
      
      {/* Tri */}
      <div className="w-full sm:w-auto">
        <select
          value={filters.sort}
          onChange={handleSortChange}
          className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
        >
          <option value="level_asc">Niveau (croissant)</option>
          <option value="level_desc">Niveau (décroissant)</option>
          <option value="title_asc">Titre (A-Z)</option>
          <option value="title_desc">Titre (Z-A)</option>
        </select>
      </div>
    </div>
  );
};

export default QuestsFilter;
