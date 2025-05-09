import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { CharacterContext } from './CharacterContext';
import { getInventory, toggleItem, consumeItem, deleteItem } from '../api/inventory';

const InventoryContext = createContext();

export const InventoryProvider = ({ children }) => {
  const { user } = useAuth();
  const { activeCharacter } = useContext(CharacterContext);
  let [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadInventory = useCallback(async () => {
    if (!activeCharacter?.id) return;
    
    try {
      setLoading(true);
      const data = await getInventory();
      setInventory(data.items);
      console.log('Inventory data:', inventory);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur de chargement');
    } finally {
      setLoading(false);
    } 
  }, [activeCharacter]);

  useEffect(() => {
    loadInventory();
  }, [loadInventory]);

  const handleEquip = async (itemId, slot) => {
    try {
      await toggleItem(itemId);
      await loadInventory();
    } catch (err) {
      setError(err.response?.data?.message || 'Échec de léquipement');
    }
  };

  const handleUse = async (itemId) => {
    try {
      await consumeItem(itemId);
      await loadInventory();
    } catch (err) {
      setError(err.response?.data?.message || 'Utilisation impossible');
    }
  };

  const handleDelete = async (itemId) => {
    try {
      await deleteItem(itemId);
      setInventory(prev => prev.filter(item => item.id !== itemId));
    } catch (err) {
      setError(err.response?.data?.message || 'Suppression échouée');
    }
  };

  return (
    <InventoryContext.Provider 
      value={{
        inventory,
        loading,
        error,
        handleEquip,
        handleUse,
        handleDelete
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventory = () => useContext(InventoryContext);