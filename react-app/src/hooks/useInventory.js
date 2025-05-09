// src/hooks/useCharacters.js
import { useContext } from 'react';
import { InventoryContext } from '../context/InventoryContext';

export const useCharacters = () => {
  const context = useContext(InventoryContext);
  
  if (!context) {
    throw new Error('useInventory must be used within a InventoryProvider');
  }
  
  return context;
};