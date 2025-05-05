import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useCharacter from '../hooks/useCharacter';
import useInventory from '../hooks/useInventory';
import InventoryList from '../components/inventory/InventoryList';
import AddItemForm from '../components/inventory/AddItemForm';
import Button from '../components/common/Button';
import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';

function InventoryPage() {
  const { activeCharacter, loading: characterLoading } = useCharacter();
  const navigate = useNavigate();
  const [showAddForm, setShowAddForm] = useState(false);

  // Si aucun personnage n'est actif, rediriger vers la page des personnages
  useEffect(() => {
    if (!characterLoading && !activeCharacter) {
      navigate('/characters');
    }
  }, [activeCharacter, characterLoading, navigate]);

  const characterId = activeCharacter?.id;
  
  const { 
    items, 
    itemTypes,
    loading, 
    error, 
    getInventoryItems, 
    getItemTypes,
    addItem, 
    updateItem, 
    deleteItem, 
    useItem 
  } = useInventory(characterId);

  // Charger l'inventaire et les types d'objets lorsque le personnage change
  useEffect(() => {
    if (characterId) {
      getInventoryItems();
      getItemTypes();
    }
  }, [characterId, getInventoryItems, getItemTypes]);

  const handleAddItem = async (itemData) => {
    const success = await addItem(itemData);
    if (success) {
      setShowAddForm(false);
    }
  };

  const handleEditItem = async (itemId, updatedItem) => {
    await updateItem(itemId, updatedItem);
  };

  const handleDeleteItem = async (itemId) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      await deleteItem(itemId);
    }
  };

  const handleUseItem = async (itemId) => {
    await useItem(itemId);
  };

  if (characterLoading || loading) {
    return <Loading />;
  }

  if (!activeCharacter) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <ErrorMessage 
          message="No active character found. Please select a character first."
          onRetry={() => navigate('/characters')}
          retryText="Go to Characters"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorMessage 
          message={error} 
          onRetry={getInventoryItems}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Inventory</h1>
          <p className="text-gray-600">
            {activeCharacter.name}'s Items ({items?.length || 0})
          </p>
        </div>
        <div>
          {showAddForm ? (
            <Button onClick={() => setShowAddForm(false)} variant="light">
              Cancel Adding
            </Button>
          ) : (
            <Button onClick={() => setShowAddForm(true)}>
              Add Item
            </Button>
          )}
        </div>
      </div>

      {showAddForm && (
        <div className="mb-8">
          <AddItemForm 
            itemTypes={itemTypes}
            onSubmit={handleAddItem}
            onCancel={() => setShowAddForm(false)}
          />
        </div>
      )}

      {items && items.length > 0 ? (
        <InventoryList 
          items={items} 
          onUseItem={handleUseItem}
          onEditItem={handleEditItem} 
          onDeleteItem={handleDeleteItem} 
          itemTypes={itemTypes}
        />
      ) : (
        <div className="bg-white shadow rounded-lg p-6 text-center">
          <p className="text-gray-600 mb-4">Your inventory is empty.</p>
          {!showAddForm && (
            <Button onClick={() => setShowAddForm(true)}>Add Your First Item</Button>
          )}
        </div>
      )}
    </div>
  );
}

export default InventoryPage;