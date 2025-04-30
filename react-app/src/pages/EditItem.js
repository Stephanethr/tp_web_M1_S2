import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getItemTypes, getItemDetails, addItem, editItem } from '../api/apiService';

const EditItem = ({ action = 'add' }) => {
  const { itemId } = useParams();
  const navigate = useNavigate();
  const isEditing = action === 'edit';
  
  const [formData, setFormData] = useState({
    name: '',
    type_id: '',
    quantity: 1
  });
  
  const [itemTypes, setItemTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Récupérer les types d'objets disponibles 
        // Dans un cas réel, remplacez ces données statiques par un appel API
        const types = [
          { id: 1, type_name: 'Arme' },
          { id: 2, type_name: 'Armure' },
          { id: 3, type_name: 'Potion' },
          { id: 4, type_name: 'Plante' },
          { id: 5, type_name: 'Outil' }
        ];
        
        setItemTypes(types);
        
        // Si nous sommes en mode édition, récupérer les détails de l'objet
        if (isEditing && itemId) {
          // Dans un cas réel, remplacez par un appel API
          // const item = await getItemDetails(itemId);
          
          // Simuler des données d'objet reçues
          const item = {
            id: itemId,
            name: 'Épée de test',
            type_id: 1,
            quantity: 1
          };
          
          setFormData({
            name: item.name,
            type_id: item.type_id.toString(),
            quantity: item.quantity
          });
        }
      } catch (err) {
        setError('Erreur lors du chargement des données');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [isEditing, itemId]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSubmitting(true);
      setError(null);
      
      // Validation de base
      if (!formData.name.trim()) {
        setError("Le nom de l'objet est requis");
        setSubmitting(false);
        return;
      }
      
      if (!formData.type_id) {
        setError("Veuillez sélectionner un type d'objet");
        setSubmitting(false);
        return;
      }
      
      const quantity = parseInt(formData.quantity);
      if (isNaN(quantity) || quantity < 1) {
        setError('La quantité doit être un nombre positif');
        setSubmitting(false);
        return;
      }
      
      // Préparer les données à envoyer
      const itemData = {
        name: formData.name,
        type_id: parseInt(formData.type_id),
        quantity: quantity
      };
      
      // Appel API (à remplacer par de vrais appels)
      if (isEditing) {
        // await editItem(itemId, itemData);
        // Simuler un délai de chargement
        await new Promise(resolve => setTimeout(resolve, 500));
      } else {
        // await addItem(itemData);
        // Simuler un délai de chargement
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      // Rediriger vers l'inventaire après succès
      navigate("/inventory", { 
        state: { 
          success: true, 
          message: isEditing ? 'Objet modifié avec succès' : 'Objet ajouté avec succès' 
        }
      });
    } catch (err) {
      setError(err.message || 'Une erreur est survenue');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">
        {isEditing ? 'Modifier un objet' : 'Ajouter un nouvel objet'}
      </h1>
      
      {error && (
        <div className="mb-6 bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
          <p className="font-bold">Erreur</p>
          <p>{error}</p>
        </div>
      )}
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label 
              htmlFor="name" 
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Nom de l'objet
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-accent focus:border-accent dark:bg-gray-700 dark:text-white"
              placeholder="Nom de l'objet"
              required
            />
          </div>
          
          <div className="mb-4">
            <label 
              htmlFor="type_id" 
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Type d'objet
            </label>
            <select
              id="type_id"
              name="type_id"
              value={formData.type_id}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-accent focus:border-accent dark:bg-gray-700 dark:text-white"
              required
            >
              <option value="">Sélectionner un type</option>
              {itemTypes.map(type => (
                <option key={type.id} value={type.id}>
                  {type.type_name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="mb-6">
            <label 
              htmlFor="quantity" 
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Quantité
            </label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              min="1"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-accent focus:border-accent dark:bg-gray-700 dark:text-white"
              required
            />
          </div>
          
          <div className="flex justify-between">
            <Link
              to="/inventory"
              className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent"
            >
              Annuler
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-accent hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent disabled:opacity-50"
            >
              {submitting ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {isEditing ? 'Mise à jour...' : 'Création...'}
                </span>
              ) : (
                <span>{isEditing ? 'Mettre à jour' : 'Ajouter'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditItem;
