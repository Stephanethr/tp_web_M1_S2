import React, { useState } from 'react';
import ItemCard from './ItemCard';
import ItemEditModal from './ItemEditModal';

function InventoryList({ items, itemTypes, onUseItem, onEditItem, onDeleteItem }) {
  const [editingItem, setEditingItem] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleEdit = (item) => {
    setEditingItem(item);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = (updatedItem) => {
    onEditItem(updatedItem.id, updatedItem);
    setIsEditModalOpen(false);
    setEditingItem(null);
  };

  const handleCancelEdit = () => {
    setIsEditModalOpen(false);
    setEditingItem(null);
  };

  // Regrouper les éléments par type
  const groupedItems = items.reduce((acc, item) => {
    const type = item.item_type || 'other';
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(item);
    return acc;
  }, {});

  return (
    <div>
      {Object.entries(groupedItems).map(([type, items]) => (
        <div key={type} className="mb-8">
          <h2 className="text-xl font-semibold mb-4 capitalize">{type}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map(item => (
              <ItemCard 
                key={item.id} 
                item={item} 
                onUse={() => onUseItem(item.id)}
                onEdit={() => handleEdit(item)}
                onDelete={() => onDeleteItem(item.id)} 
              />
            ))}
          </div>
        </div>
      ))}

      {isEditModalOpen && (
        <ItemEditModal 
          item={editingItem} 
          itemTypes={itemTypes} 
          onSave={handleSaveEdit} 
          onCancel={handleCancelEdit} 
        />
      )}

      {items.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-600">No items in your inventory yet.</p>
        </div>
      )}
    </div>
  );
}

export default InventoryList;