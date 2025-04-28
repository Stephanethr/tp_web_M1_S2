import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getInventory, consumeItem, deleteItem } from '../api/apiService';
import { useAuth } from '../context/AuthContext';

const Inventory = () => {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [characterName, setCharacterName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('item_name');
  const [order, setOrder] = useState('asc');

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        setLoading(true);
        const data = await getInventory(sortBy, order);
        setItems(data.items || []);
        setCharacterName(data.character_name || '');
        setError(null);
      } catch (err) {
        setError('Erreur lors du chargement de l\'inventaire');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchInventory();
    }
  }, [user, sortBy, order]);

  const handleSort = (column) => {
    if (sortBy === column) {
      setOrder(order === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setOrder('asc');
    }
  };

  const handleConsume = async (itemId) => {
    try {
      const response = await consumeItem(itemId);
      // Mettre à jour l'inventaire après consommation
      const data = await getInventory(sortBy, order);
      setItems(data.items || []);
      alert(response.message || 'Objet consommé avec succès');
    } catch (err) {
      setError('Erreur lors de la consommation de l\'objet');
      console.error(err);
    }
  };

  const handleDelete = async (itemId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet objet ?')) {
      try {
        await deleteItem(itemId);
        // Mettre à jour l'inventaire après suppression
        const data = await getInventory(sortBy, order);
        setItems(data.items || []);
      } catch (err) {
        setError('Erreur lors de la suppression de l\'objet');
        console.error(err);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <svg className="animate-spin h-10 w-10 text-accent" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
        <p>{error}</p>
      </div>
    );
  }

  if (!characterName) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Aucun personnage actif</h2>
        <p className="mb-6">Vous devez créer ou sélectionner un personnage pour accéder à l'inventaire.</p>
        <div className="space-x-4">
          <Link to="/character/create" className="btn-primary">Créer un personnage</Link>
          <Link to="/characters" className="btn-secondary">Sélectionner un personnage</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Inventaire de {characterName}</h1>
        <Link to="/add_item" className="btn-primary">
          Ajouter un objet
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="card text-center py-8">
          <p className="mb-4">Votre inventaire est vide.</p>
          <Link to="/add_item" className="btn-primary">
            Ajouter votre premier objet
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-700">
                <th
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('item_name')}
                >
                  <div className="flex items-center">
                    Nom
                    {sortBy === 'item_name' && (
                      <span className="ml-1">
                        {order === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('item_type')}
                >
                  <div className="flex items-center">
                    Type
                    {sortBy === 'item_type' && (
                      <span className="ml-1">
                        {order === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('item_quantity')}
                >
                  <div className="flex items-center">
                    Quantité
                    {sortBy === 'item_quantity' && (
                      <span className="ml-1">
                        {order === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {items.map((item) => (
                <tr key={item.item_id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">{item.item_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.item_type}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.item_quantity}</td>
                  <td className="px-6 py-4 whitespace-nowrap flex space-x-2">
                    <Link
                      to={`/edit/${item.item_id}`}
                      className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                    >
                      Modifier
                    </Link>
                    {item.item_type === 'potion' || item.item_type === 'plante' ? (
                      <button
                        onClick={() => handleConsume(item.item_id)}
                        className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                      >
                        Consommer
                      </button>
                    ) : null}
                    <button
                      onClick={() => handleDelete(item.item_id)}
                      className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Inventory;