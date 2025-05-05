import React from 'react';
import {
  TrashIcon,
  PencilIcon,
  BeakerIcon,
  LockClosedIcon,
  LockOpenIcon
} from '@heroicons/react/24/outline';

// Types d'objets et leurs icônes/couleurs correspondantes
const ITEM_STYLES = {
  weapon: {
    icon: '⚔️',
    bgColor: 'bg-red-100',
    textColor: 'text-red-800',
    borderColor: 'border-red-200'
  },
  armor: {
    icon: '🛡️',
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-800',
    borderColor: 'border-blue-200'
  },
  potion: {
    icon: '🧪',
    bgColor: 'bg-purple-100',
    textColor: 'text-purple-800',
    borderColor: 'border-purple-200'
  },
  accessory: {
    icon: '💍',
    bgColor: 'bg-yellow-100',
    textColor: 'text-yellow-800',
    borderColor: 'border-yellow-200'
  },
  // Par défaut
  default: {
    icon: '📦',
    bgColor: 'bg-gray-100',
    textColor: 'text-gray-800',
    borderColor: 'border-gray-200'
  }
};

const getItemStyle = (type) => {
  const typeLower = type.toLowerCase();
  return ITEM_STYLES[typeLower] || ITEM_STYLES.default;
};

const ItemCard = ({ item, onEdit, onDelete, onUse, equipped, onToggleEquip }) => {
  const itemStyle = getItemStyle(item.type);

  return (
    <div className={`relative border ${itemStyle.borderColor} rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow`}>
      {/* Badge pour les objets équipés */}
      {equipped && (
        <div className="absolute top-0 right-0 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-bl-lg">
          Équipé
        </div>
      )}
      
      <div className="flex items-start p-4">
        <div className={`flex-shrink-0 w-12 h-12 ${itemStyle.bgColor} ${itemStyle.textColor} rounded-lg flex items-center justify-center text-2xl`}>
          {itemStyle.icon}
        </div>
        
        <div className="ml-4 flex-grow">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
              <p className="text-sm text-gray-500">Type: {item.type}</p>
            </div>
            <div className="text-sm font-medium bg-gray-100 px-2 py-1 rounded">
              Qté: {item.quantity}
            </div>
          </div>
          
          {item.description && (
            <p className="mt-1 text-sm text-gray-600">{item.description}</p>
          )}
          
          {/* Actions sur l'objet */}
          <div className="mt-3 flex items-center space-x-2">
            {item.can_be_consumed && (
              <button 
                onClick={() => onUse(item.id)}
                className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <BeakerIcon className="h-4 w-4 mr-1" />
                Utiliser
              </button>
            )}
            
            {(item.type === 'weapon' || item.type === 'armor' || item.type === 'accessory') && (
              <button 
                onClick={() => onToggleEquip(item.id, item.type, !equipped)}
                className={`inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded ${
                  equipped
                    ? 'text-orange-700 bg-orange-100 hover:bg-orange-200'
                    : 'text-green-700 bg-green-100 hover:bg-green-200'
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`}
              >
                {equipped ? (
                  <>
                    <LockOpenIcon className="h-4 w-4 mr-1" />
                    Déséquiper
                  </>
                ) : (
                  <>
                    <LockClosedIcon className="h-4 w-4 mr-1" />
                    Équiper
                  </>
                )}
              </button>
            )}
            
            <button 
              onClick={() => onEdit(item)}
              className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              <PencilIcon className="h-4 w-4 mr-1" />
              Modifier
            </button>
            
            <button 
              onClick={() => onDelete(item.id)}
              className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <TrashIcon className="h-4 w-4 mr-1" />
              Supprimer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemCard;
