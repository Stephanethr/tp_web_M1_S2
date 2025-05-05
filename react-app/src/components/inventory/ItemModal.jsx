import React, { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

const ItemModal = ({ isOpen, onClose, item, itemTypes, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    type_id: '',
    quantity: 1,
    description: ''
  });

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name || '',
        type_id: item.type_id || '',
        quantity: item.quantity || 1,
        description: item.description || ''
      });
    } else {
      setFormData({
        name: '',
        type_id: '',
        quantity: 1,
        description: ''
      });
    }
  }, [item]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantity' || name === 'type_id' ? parseInt(value) : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData, item?.id);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={onClose}></div>
        </div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    {item ? 'Modifier l\'objet' : 'Ajouter un objet'}
                  </h3>
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-500 focus:outline-none"
                    onClick={onClose}
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Nom de l'objet
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="type_id" className="block text-sm font-medium text-gray-700 mb-1">
                      Type d'objet
                    </label>
                    <select
                      id="type_id"
                      name="type_id"
                      value={formData.type_id}
                      onChange={handleChange}
                      required
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    >
                      <option value="">Sélectionner un type</option>
                      {itemTypes.map(type => (
                        <option key={type.id} value={type.id}>
                          {type.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-4">
                    <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                      Quantité
                    </label>
                    <input
                      type="number"
                      id="quantity"
                      name="quantity"
                      min="1"
                      value={formData.quantity}
                      onChange={handleChange}
                      required
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                      Description (optionnelle)
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      rows="3"
                      value={formData.description}
                      onChange={handleChange}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    />
                  </div>

                  <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                    <button
                      type="submit"
                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm"
                    >
                      {item ? 'Mettre à jour' : 'Ajouter'}
                    </button>
                    <button
                      type="button"
                      className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:w-auto sm:text-sm"
                      onClick={onClose}
                    >
                      Annuler
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemModal;
