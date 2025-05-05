import React, { useState, useEffect } from 'react';
import Button from '../common/Button';
import Card from '../common/Card';

function AddItemForm({ itemTypes, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    type_id: '',
    quantity: 1
  });
  
  const [validationErrors, setValidationErrors] = useState({});

  // Initialisez le premier type disponible
  useEffect(() => {
    if (itemTypes.length > 0 && !formData.type_id) {
      setFormData(prev => ({
        ...prev,
        type_id: itemTypes[0].id
      }));
    }
  }, [itemTypes, formData.type_id]);

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
      onSubmit(formData);
      // Réinitialiser le formulaire
      setFormData({
        name: '',
        type_id: itemTypes.length > 0 ? itemTypes[0].id : '',
        quantity: 1
      });
    }
  };

  return (
    <Card>
      <h3 className="text-lg font-semibold mb-4">Add New Item</h3>
      
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

        <div className="flex justify-end space-x-3">
          <Button type="button" variant="light" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            Add Item
          </Button>
        </div>
      </form>
    </Card>
  );
}

export default AddItemForm;