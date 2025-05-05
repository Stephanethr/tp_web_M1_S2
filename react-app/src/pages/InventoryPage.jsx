import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useInventory from '../hooks/useInventory';
import useCharacter from '../hooks/useCharacter';
import InventoryList from '../components/inventory/InventoryList';
import AddItemForm from '../components/inventory/AddItemForm';
import Button from '../components/common/Button';
import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';

function InventoryPage() {
  const { 
    items, 
    itemTypes, 
    loading, 
    error, 
    getInventory, 
    getItemTypes, 
    addItem, 
    editItem, 
    deleteItem, 
    useItem 
  } = useInventory();
  
  const { activeCharacter } = useCharacter();
  const [showAddForm, setShowAddForm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!activeCharacter) {
      navigate('/characters');
      return;
    }
    
    getInventory();
    getItemTypes();
  }, [getInventory, getItemTypes, activeCharacter, navigate]);

  const handleAddItem = async (itemData) => {
    const success = await addItem(itemData);
    if (success) {
      setShowAddForm(false);
      getInventory();
    }
  };

  const handleEditItem = async (itemId, itemData) => {
    const success = await editItem(itemId, itemData);
    if (success) {
      getInventory();
    }
  };

  const handleDeleteItem = async (itemId) => {
    const success = await deleteItem(itemId);
    if (success) {
      getInventory();
    }
  };

  const handleUseItem = async (itemId) => {
    const success = await useItem(itemId);
    if (success) {
      getInventory();
    }
  };

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Inventory</h1>
        <Button onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? 'Cancel' : 'Add Item'}
        </Button>
      </div>

      {activeCharacter && (
        <div className="bg-indigo-50 p-4 rounded-lg mb-6">
          <p className="text-indigo-800">
            Managing inventory for <span className="font-bold">{activeCharacter.name}</span>
          </p>
        </div>
      )}

      {showAddForm && itemTypes.length > 0 && (
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Add New Item</h2>
          <AddItemForm onSubmit={handleAddItem} itemTypes={itemTypes} />
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