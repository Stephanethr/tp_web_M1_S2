import React, { useState, useEffect } from 'react';
import Button from '../common/Button';

function ItemEditModal({ item, itemTypes, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    id: item?.id || '',
    name: item?.item_name || '',
    type_id: '',
    quantity: item?.item_quantity || 1
  });
  
  const [validationErrors, setValidationErrors] = useState({});

  // Trouver l'ID du type d'objet à partir du nom du type
  useEffect(() => {
    if (itemTypes.length > 0 && item?.item_type) {
      const typeObj = itemTypes.find(type => 
        type.type_name.toLowerCase() === item.item_type.toLowerCase()
      );
      
      if (typeObj) {
        setFormData(prev => ({
          ...prev,
          type_id: typeObj.id
        }));
      } else {
        // Fallback au premier type si le type actuel n'est pas trouvé
        setFormData(prev => ({
          ...prev,
          type_id: itemTypes[0].id
        }));
      }
    }
  }, [item, itemTypes]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Si c'est le champ quantité, assurez-vous qu'il s'agit d'un nombre positif
    if (name === 'quantity') {
      const numValue = parseInt(value, 10);
      setFormData(prev => ({
        ...prev,
        [name]: isNaN(numValue) ? '' : Math.max(1, numValue)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Item name is required';
    }
    
    if (!formData.type_id) {
      errors.type_id = 'Please select an item type';
    }
    
    if (!formData.quantity || formData.quantity < 1) {
      errors.quantity = 'Quantity must be at least 1';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Trouver le nom du type pour le retourner à l'API
      const selectedType = itemTypes.find(type => type.id === formData.type_id);
      
      onSave({
        id: formData.id,
        item_name: formData.name,
        item_type: selectedType ? selectedType.type_name : '',
        item_quantity: formData.quantity,
        // Préserver les autres champs si nécessaire
        ...item,
        name: formData.name,
        type_id: formData.type_id,
        quantity: formData.quantity
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Edit Item</h3>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Item Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
                  validationErrors.name ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter item name"
              />
              {validationErrors.name && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.name}</p>
              )}
            </div>

            <div className="mb-4">
              <label htmlFor="type_id" className="block text-sm font-medium text-gray-700 mb-1">
                Item Type
              </label>
              <select
                id="type_id"
                name="type_id"
                value={formData.type_id}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
                  validationErrors.type_id ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="" disabled>Select item type</option>
                {itemTypes.map(type => (
                  <option key={type.id} value={type.id} className="capitalize">
                    {type.type_name}
                  </option>
                ))}
              </select>
              {validationErrors.type_id && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.type_id}</p>
              )}
            </div>

            <div className="mb-4">
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                Quantity
              </label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                min="1"
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
                  validationErrors.quantity ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {validationErrors.quantity && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.quantity}</p>
              )}
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <Button type="button" variant="light" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit">
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ItemEditModal;