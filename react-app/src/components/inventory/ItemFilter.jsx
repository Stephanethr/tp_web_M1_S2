import React from 'react';
import { MagnifyingGlassIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';

const ItemFilter = ({ filters, onFilterChange, itemTypes }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onFilterChange({ ...filters, [name]: value });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-6">
      <div className="flex items-center mb-2">
        <AdjustmentsHorizontalIcon className="h-5 w-5 text-gray-500 mr-2" />
        <h3 className="font-medium text-gray-700">Filtres</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Recherche par nom */}
        <div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              name="search"
              value={filters.search || ''}
              onChange={handleChange}
              placeholder="Rechercher un objet..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:border-primary-500 focus:ring-primary-500 transition duration-150 ease-in-out"
            />
          </div>
        </div>

        {/* Filtre par type */}
        <div>
          <select
            name="type"
            value={filters.type || ''}
            onChange={handleChange}
            className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:border-primary-500 focus:ring-primary-500"
          >
            <option value="">Tous les types</option>
            {itemTypes.map(type => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
        </div>

        {/* Tri */}
        <div>
          <select
            name="sort"
            value={filters.sort || 'name_asc'}
            onChange={handleChange}
            className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:border-primary-500 focus:ring-primary-500"
          >
            <option value="name_asc">Nom (A-Z)</option>
            <option value="name_desc">Nom (Z-A)</option>
            <option value="quantity_asc">Quantité (Croissant)</option>
            <option value="quantity_desc">Quantité (Décroissant)</option>
            <option value="type_asc">Type (A-Z)</option>
            <option value="type_desc">Type (Z-A)</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default ItemFilter;
