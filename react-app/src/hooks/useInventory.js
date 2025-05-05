import { useState, useCallback } from 'react';
import apiService from '../services/apiService';

const useInventory = (characterId) => {
  const [items, setItems] = useState([]);
  const [itemTypes, setItemTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Récupérer tous les objets de l'inventaire
  const getInventoryItems = useCallback(async () => {
    if (!characterId) return [];
    
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.getInventoryItems(characterId);
      setItems(response.data);
      return response.data;
    } catch (err) {
      setError(err.message || 'Failed to load inventory items');
      return [];
    } finally {
      setLoading(false);
    }
  }, [characterId]);

  // Récupérer les types d'objets disponibles
  const getItemTypes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.getItemTypes();
      setItemTypes(response.data);
      return response.data;
    } catch (err) {
      setError(err.message || 'Failed to load item types');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Ajouter un nouvel objet à l'inventaire
  const addItem = useCallback(async (itemData) => {
    if (!characterId) return null;
    
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.addInventoryItem(characterId, itemData);
      // Rafraîchir la liste des objets
      await getInventoryItems();
      return response.data;
    } catch (err) {
      setError(err.message || 'Failed to add item');
      return null;
    } finally {
      setLoading(false);
    }
  }, [characterId, getInventoryItems]);

  // Modifier un objet existant
  const updateItem = useCallback(async (itemId, itemData) => {
    if (!characterId) return false;
    
    setLoading(true);
    setError(null);
    try {
      await apiService.updateInventoryItem(itemId, itemData);
      // Mettre à jour l'objet dans la liste locale
      setItems(prevItems => 
        prevItems.map(item => 
          item.id === itemId ? { ...item, ...itemData } : item
        )
      );
      return true;
    } catch (err) {
      setError(err.message || 'Failed to update item');
      return false;
    } finally {
      setLoading(false);
    }
  }, [characterId]);

  // Supprimer un objet
  const deleteItem = useCallback(async (itemId) => {
    if (!characterId) return false;
    
    setLoading(true);
    setError(null);
    try {
      await apiService.deleteInventoryItem(itemId);
      // Retirer l'objet de la liste locale
      setItems(prevItems => prevItems.filter(item => item.id !== itemId));
      return true;
    } catch (err) {
      setError(err.message || 'Failed to delete item');
      return false;
    } finally {
      setLoading(false);
    }
  }, [characterId]);

  // Utiliser un objet (pour les potions, etc.)
  const consumeItem = useCallback(async (itemId) => {
    if (!characterId) return false;
    
    setLoading(true);
    setError(null);
    try {
      await apiService.consumeInventoryItem(itemId);
      // Rafraîchir la liste des objets
      await getInventoryItems();
      return true;
    } catch (err) {
      setError(err.message || 'Failed to use item');
      return false;
    } finally {
      setLoading(false);
    }
  }, [characterId, getInventoryItems]);

  return {
    items,
    itemTypes,
    loading,
    error,
    getInventoryItems,
    getItemTypes,
    addItem,
    updateItem,
    deleteItem,
    consumeItem,
  };
};

export default useInventory;