import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import inventoryService from '../../services/inventoryService';
import ItemCard from './ItemCard';
import ItemModal from './ItemModal';
import ItemFilter from './ItemFilter';
import { PlusIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';

const InventoryList = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [equipped, setEquipped] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [characterName, setCharacterName] = useState('');
  const [itemTypes, setItemTypes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    type: '',
    sort: 'name_asc'
  });

  // Récupérer les données de l'inventaire
  const fetchInventory = async () => {
    setLoading(true);
    try {
      const sortParam = filters.sort ? filters.sort.split('_') : ['name', 'asc'];
      const response = await inventoryService.getInventory({
        sort_by: sortParam[0],
        order: sortParam[1],
        search: filters.search,
        type: filters.type
      });

      if (response.success) {
        setItems(response.items || []);
        setCharacterName(response.character_name || '');
        
        // Récupérer les objets équipés depuis les données
        const equippedIds = (response.equipped || []).map(item => item.inventory_id);
        setEquipped(equippedIds);
      } else {
        throw new Error(response.message || "Erreur lors du chargement de l'inventaire");
      }

      // Récupérer les types d'objets
      const typesResponse = await inventoryService.getItemTypes();
      if (typesResponse.success) {
        setItemTypes(typesResponse.item_types || []);
      }
    } catch (err) {
      console.error("Erreur lors du chargement de l'inventaire:", err);
      setError(err.message || "Impossible de charger l'inventaire.");
      
      // Rediriger vers la création/sélection de personnage si nécessaire
      if (err.response && err.response.status === 400) {
        navigate('/characters');
      }
    } finally {
      setLoading(false);
    }
  };

  // Charger l'inventaire au chargement du composant et quand les filtres changent
  useEffect(() => {
    fetchInventory();
  }, [filters, navigate]);

  // Ouvrir le modal pour ajouter/modifier un item
  const handleOpenModal = (item = null) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  // Fermer le modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  // Gérer la sauvegarde d'un item
  const handleSaveItem = async (formData, itemId) => {
    try {
      if (itemId) {
        // Mettre à jour un item existant
        await inventoryService.updateItem(itemId, formData);
      } else {
        // Ajouter un nouvel item
        await inventoryService.addItem(formData);
      }
      fetchInventory(); // Rafraîchir les données
      handleCloseModal();
    } catch (error) {
      console.error("Erreur lors de la sauvegarde de l'objet:", error);
      setError(error.message || "Impossible de sauvegarder l'objet.");
    }
  };

  // Gérer la suppression d'un item
  const handleDeleteItem = async (itemId) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet objet ?")) {
      try {
        await inventoryService.deleteItem(itemId);
        fetchInventory(); // Rafraîchir les données
      } catch (error) {
        console.error("Erreur lors de la suppression de l'objet:", error);
        setError(error.message || "Impossible de supprimer l'objet.");
      }
    }
  };

  // Gérer l'utilisation d'un item
  const handleUseItem = async (itemId) => {
    try {
      const response = await inventoryService.useItem(itemId);
      alert(response.effect || "Vous avez utilisé cet objet.");
      fetchInventory(); // Rafraîchir les données
    } catch (error) {
      console.error("Erreur lors de l'utilisation de l'objet:", error);
      setError(error.message || "Impossible d'utiliser l'objet.");
    }
  };

  // Gérer l'équipement/déséquipement d'un item
  const handleToggleEquip = async (itemId, itemType, equip) => {
    try {
      if (equip) {
        // Équiper l'objet
        await inventoryService.equipItem(itemId, itemType);
      } else {
        // Déséquiper l'objet
        await inventoryService.unequipItem(itemId);
      }
      fetchInventory(); // Rafraîchir les données
    } catch (error) {
      console.error("Erreur lors de l'équipement/déséquipement de l'objet:", error);
      setError(error.message || "Impossible d'équiper/déséquiper l'objet.");
    }
  };

  // S'il n'y a pas de personnage actif
  if (error && error.includes('sélectionner un personnage')) {
    return (
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <ExclamationCircleIcon className="h-5 w-5 text-yellow-400" aria-hidden="true" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              Vous devez d'abord sélectionner un personnage pour accéder à l'inventaire.
            </p>
            <div className="mt-4">
              <button
                onClick={() => navigate('/characters')}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Voir mes personnages
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-700"></div>
      </div>
    );
  }

  return (
    <div>
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <ExclamationCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Inventaire de {characterName}
        </h1>
        <p className="text-gray-600 mt-1">
          Gérez les objets que votre personnage a collectés au cours de ses aventures.
        </p>
      </div>

      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => handleOpenModal()}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <PlusIcon className="h-5 w-5 mr-1" />
          Ajouter un objet
        </button>
      </div>

      {/* Filtres */}
      <ItemFilter
        filters={filters}
        onFilterChange={setFilters}
        itemTypes={itemTypes}
      />

      {/* Liste des objets */}
      {items.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <p className="text-gray-500">Votre inventaire est vide. Ajoutez des objets ou partez à l'aventure pour en obtenir !</p>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map(item => (
            <ItemCard
              key={item.id}
              item={item}
              equipped={equipped.includes(item.id)}
              onEdit={handleOpenModal}
              onDelete={handleDeleteItem}
              onUse={handleUseItem}
              onToggleEquip={handleToggleEquip}
            />
          ))}
        </div>
      )}

      {/* Modal pour ajouter/modifier des objets */}
      <ItemModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        item={selectedItem}
        itemTypes={itemTypes}
        onSave={handleSaveItem}
      />
    </div>
  );
};

export default InventoryList;
