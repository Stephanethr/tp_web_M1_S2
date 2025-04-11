import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

function InventoryList() {
  const [items, setItems] = useState([]);
  const [characterName, setCharacterName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [sortBy, setSortBy] = useState('item_name');
  const [order, setOrder] = useState('asc');
  const navigate = useNavigate();

  useEffect(() => {
    fetchInventory();
  }, [sortBy, order]);

  const fetchInventory = async () => {
    try {
      const response = await api.get(`/inventory?sort_by=${sortBy}&order=${order}`);
      setItems(response.data.items || []);
      setCharacterName(response.data.character_name || 'Personnage');
      setError('');
    } catch (err) {
      console.error('Error fetching inventory:', err);
      setError('Impossible de récupérer votre inventaire.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSort = (column) => {
    if (column === sortBy) {
      // Toggle order if clicking the same column
      setOrder(order === 'asc' ? 'desc' : 'asc');
    } else {
      // Default to ascending order for a new column
      setSortBy(column);
      setOrder('asc');
    }
  };

  const deleteItem = async (itemId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet objet ?')) {
      return;
    }

    try {
      await api.post(`/delete/${itemId}`);
      // Refresh the inventory list
      fetchInventory();
    } catch (err) {
      console.error('Error deleting item:', err);
      setError('Erreur lors de la suppression de l\'objet.');
    }
  };

  const consumeItem = async (itemId, itemType) => {
    try {
      const response = await api.post(`/consume/${itemId}`);
      // Refresh the inventory list
      fetchInventory();
      // Show success message
      alert(`Objet consommé ! ${
        itemType === 'potion' 
          ? 'Vous avez récupéré 20 points de vie!' 
          : 'Votre attaque a augmenté de 5 points!'
      }`);
    } catch (err) {
      console.error('Error consuming item:', err);
      setError('Erreur lors de la consommation de l\'objet.');
    }
  };

  if (isLoading) {
    return <div className="text-center mt-5"><div className="spinner-border"></div></div>;
  }

  return (
    <div className="inventory-container">
      <h2>Inventaire de {characterName}</h2>
      
      <div className="mb-3">
        <button 
          className="btn btn-success" 
          onClick={() => navigate('/add-item')}
        >
          Ajouter un objet
        </button>
      </div>
      
      {error && <div className="alert alert-danger">{error}</div>}
      
      {items.length === 0 ? (
        <div className="alert alert-info">
          Votre inventaire est vide. Ajoutez des objets ou partez à l'aventure pour en trouver!
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover">
            <thead>
              <tr>
                <th onClick={() => handleSort('item_name')} style={{ cursor: 'pointer' }}>
                  Nom {sortBy === 'item_name' && (order === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('item_type')} style={{ cursor: 'pointer' }}>
                  Type {sortBy === 'item_type' && (order === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('item_quantity')} style={{ cursor: 'pointer' }}>
                  Quantité {sortBy === 'item_quantity' && (order === 'asc' ? '↑' : '↓')}
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.item_id}>
                  <td>{item.item_name}</td>
                  <td>{item.item_type}</td>
                  <td>{item.item_quantity}</td>
                  <td>
                    <div className="btn-group btn-group-sm">
                      <button 
                        className="btn btn-primary"
                        onClick={() => navigate(`/edit-item/${item.item_id}`)}
                      >
                        Modifier
                      </button>
                      
                      {(item.item_type === 'potion' || item.item_type === 'plante') && (
                        <button 
                          className="btn btn-success"
                          onClick={() => consumeItem(item.item_id, item.item_type)}
                        >
                          Utiliser
                        </button>
                      )}
                      
                      <button 
                        className="btn btn-danger"
                        onClick={() => deleteItem(item.item_id)}
                      >
                        Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default InventoryList;
