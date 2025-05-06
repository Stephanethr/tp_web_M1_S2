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

  // Filtrage des objets côté client
  const filteredItems = () => {
    let filtered = [...items];

    // Filtrage par recherche (nom)
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(searchLower) || 
        (item.description && item.description.toLowerCase().includes(searchLower))
      );
    }

    // Filtrage par type
    if (filters.type) {
      filtered = filtered.filter(item => item.type_id === parseInt(filters.type));
    }

    // Tri
    const [sortField, sortOrder] = filters.sort ? filters.sort.split('_') : ['name', 'asc'];
    filtered.sort((a, b) => {
      let compareA, compareB;

      if (sortField === 'name') {
        compareA = a.name.toLowerCase();
        compareB = b.name.toLowerCase();
      } else if (sortField === 'quantity') {
        compareA = a.quantity;
        compareB = b.quantity;
      } else if (sortField === 'type') {
        compareA = a.type_name?.toLowerCase() || '';
        compareB = b.type_name?.toLowerCase() || '';
      }

      if (compareA < compareB) return sortOrder === 'asc' ? -1 : 1;
      if (compareA > compareB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  };

  // Récupérer les données de l'inventaire
  const fetchInventory = async () => {
    setLoading(true);
    try {
      const response = await inventoryService.getInventory();

      if (response.success) {
        setItems(response.items || []);
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

  // Charger l'inventaire au chargement du composant
  useEffect(() => {
    fetchInventory();
  }, [navigate]);

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

  // Gérer l'équipement/déséquipement d'un item (maintenant le fait avec useItem)
  const handleToggleEquip = async (itemId) => {
    try {
      const response = await inventoryService.useItem(itemId);
      alert(response.effect || "Statut d'équipement modifié.");
      fetchInventory(); // Rafraîchir les données
    } catch (error) {
      console.error("Erreur lors de l'équipement/déséquipement de l'objet:", error);
      setError(error.message || "Impossible d'équiper/déséquiper l'objet.");
    }
  };

  // S'il n'y a pas de personnage actif
  if (error && error.includes('Aucun personnage actif sélectionné')) {
    return (
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <ExclamationCircleIcon className="h-5 w-5 text-yellow-400" aria-hidden="true" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              Vous devez d'abord sélectionner un personnage actif pour accéder à l'inventaire.
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

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Inventaire</h1>
        <button
          onClick={() => handleOpenModal()}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Ajouter un objet
        </button>
      </div>

      {/* Message d'erreur */}
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

      {/* Filtres */}
      <ItemFilter
        filters={filters}
        onFilterChange={setFilters}
        itemTypes={itemTypes}
      />

      {/* Liste des objets */}
      {loading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      ) : filteredItems().length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems().map(item => (
            <ItemCard
              key={item.id}
              item={{
                id: item.id,
                name: item.name,
                type: item.type_name,
                type_id: item.type_id,
                quantity: item.quantity,
                description: item.description,
                can_be_consumed: item.type_id === 3, // Potions sont consommables
                can_be_equipped: item.type_id === 1 || item.type_id === 2 // Armes et armures
              }}
              equipped={item.is_equipped}
              onEdit={handleOpenModal}
              onDelete={handleDeleteItem}
              onUse={handleUseItem}
              onToggleEquip={handleToggleEquip}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-500">Aucun objet trouvé dans votre inventaire.</p>
          <button 
            onClick={() => handleOpenModal()}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Ajouter votre premier objet
          </button>
        </div>
      )}

      {/* Modal d'ajout/édition d'objet */}
      {isModalOpen && (
        <ItemModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSaveItem}
          item={selectedItem}
          itemTypes={itemTypes}
        />
      )}
    </div>
  );
};

export default InventoryList;
