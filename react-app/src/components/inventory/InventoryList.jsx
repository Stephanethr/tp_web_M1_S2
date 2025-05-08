import React from 'react';
import { InventoryItem } from './InventoryItem';
import { EmptyState } from '../ui/EmptyState';

export const InventoryList = ({ items }) => {
  if (items.length === 0) {
    return <EmptyState 
      title="Inventaire vide"
      message="Vous n'avez aucun objet dans votre inventaire"
      icon="📦"
    />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
      {items.map(item => (
        <InventoryItem
          key={item.id}
          item={item}
          onEquip={(slot) => handleEquip(item.id, slot)}
          onDelete={() => handleDelete(item.id)}
          onUse={() => handleUse(item.id)}
        />
      ))}
    </div>
  );
};