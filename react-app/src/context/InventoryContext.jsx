import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { CharacterContext } from './CharacterContext';
import { inventoryAPI } from '../api/inventory';

const InventoryContext = createContext();

export const InventoryProvider = ({ children }) => {
  const { user } = useAuth();
  const { activeCharacter } = useContext(CharacterContext);
  const [inventory, setInventory] = useState([]);
  const [equipped, setEquipped] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadInventory = useCallback(async () => {
    if (!activeCharacter?.id) return;
    
    try {
      setLoading(true);
      const { data } = await inventoryAPI.getAll(activeCharacter.id);
      setInventory(data.items);
      setEquipped(data.equipped);
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
      await inventoryAPI.equipItem(itemId);
      await loadInventory();
    } catch (err) {
      setError(err.response?.data?.message || 'Échec de léquipement');
    }
  };

  const handleUse = async (itemId) => {
    try {
      await inventoryAPI.useItem(itemId);
      await loadInventory();
    } catch (err) {
      setError(err.response?.data?.message || 'Utilisation impossible');
    }
  };

  const handleDelete = async (itemId) => {
    try {
      await inventoryAPI.deleteItem(itemId);
      setInventory(prev => prev.filter(item => item.id !== itemId));
    } catch (err) {
      setError(err.response?.data?.message || 'Suppression échouée');
    }
  };

  return (
    <InventoryContext.Provider 
      value={{
        inventory,
        equipped,
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