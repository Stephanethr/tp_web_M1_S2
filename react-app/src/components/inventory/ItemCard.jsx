import React from 'react';
import Card from '../common/Card';
import Button from '../common/Button';

// Obtenir l'icône pour chaque type d'objet
const getItemIcon = (type) => {
  switch (type?.toLowerCase()) {
    case 'weapon':
      return '⚔️';
    case 'armor':
      return '🛡️';
    case 'potion':
      return '🧪';
    case 'plante':
      return '🌿';
    case 'treasure':
      return '💎';
    case 'scroll':
      return '📜';
    case 'food':
      return '🍖';
    default:
      return '📦';
  }
};

// Vérifier si un objet peut être consommé
const isConsumable = (type) => {
    return ['potion', 'plante', 'food'].includes(type?.toLowerCase());
  };
  
  function ItemCard({ item, onUse, onEdit, onDelete }) {
    return (
      <Card className="flex flex-col h-full">
        <div className="flex items-start mb-4">
          <div className={`p-3 rounded-full bg-${
            item.item_type === 'weapon' ? 'red' :
            item.item_type === 'armor' ? 'blue' :
            item.item_type === 'potion' ? 'purple' :
            item.item_type === 'plante' ? 'green' :
            'gray'
          }-100`}>
            <span className="text-2xl" role="img" aria-label={item.item_type}>
              {getItemIcon(item.item_type)}
            </span>
          </div>
          
          <div className="ml-3 flex-1">
            <h3 className="text-lg font-medium">{item.item_name}</h3>
            <p className="text-sm text-gray-600 capitalize">{item.item_type}</p>
            <div className="mt-1">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                Quantity: {item.item_quantity}
              </span>
            </div>
          </div>
        </div>
        
        <div className="mt-auto flex space-x-2">
          {isConsumable(item.item_type) && (
            <Button 
              onClick={onUse} 
              variant="success" 
              disabled={item.item_quantity < 1}
              fullWidth
            >
              Use
            </Button>
          )}
          <Button onClick={onEdit} variant="light" fullWidth>
            Edit
          </Button>
          <Button onClick={onDelete} variant="danger" fullWidth>
            Delete
          </Button>
        </div>
      </Card>
    );
  }
  
  export default ItemCard;