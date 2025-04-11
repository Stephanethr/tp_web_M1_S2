import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';

function ItemEditor({ isEditing = false }) {
  const { itemId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    type_id: '',
    quantity: 1
  });
  const [itemTypes, setItemTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch item types from API
    const fetchItemTypes = async () => {
      try {
        const response = await api.get('/item-types');
        setItemTypes(response.data || []);
      } catch (err) {
        console.error('Error fetching item types:', err);
        setError('Impossible de récupérer les types d\'objets.');
      }
    };

    // If editing, fetch the item data
    const fetchItemData = async () => {
      try {
        const response = await api.get(`/edit/${itemId}`);
        setFormData({
          name: response.data.name,
          type_id: response.data.type_id.toString(),
          quantity: response.data.quantity
        });
      } catch (err) {
        console.error('Error fetching item data:', err);
        setError('Impossible de récupérer les données de l\'objet.');
      }
    };

    fetchItemTypes();
    
    if (isEditing && itemId) {
      fetchItemData();
    }
    
    setIsLoading(false);
  }, [isEditing, itemId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const formDataObj = new FormData();
      formDataObj.append('name', formData.name);
      formDataObj.append('type_id', formData.type_id);
      formDataObj.append('quantity', formData.quantity);
      
      if (isEditing) {
        await api.post(`/edit/${itemId}`, formDataObj, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      } else {
        await api.post('/add_item', formDataObj, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      }
      
      navigate('/inventory');
    } catch (err) {
      console.error('Error saving item:', err);
      setError('Erreur lors de l\'enregistrement de l\'objet.');
    }
  };

  if (isLoading) {
    return <div className="text-center mt-5"><div className="spinner-border"></div></div>;
  }

  return (
    <div className="item-editor-container">
      <div className="card">
        <div className="card-header">
          <h2>{isEditing ? 'Modifier un objet' : 'Ajouter un objet'}</h2>
        </div>
        <div className="card-body">
          {error && <div className="alert alert-danger">{error}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">Nom de l'objet</label>
              <input
                type="text"
                className="form-control"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="mb-3">
              <label htmlFor="type_id" className="form-label">Type d'objet</label>
              <select
                className="form-select"
                id="type_id"
                name="type_id"
                value={formData.type_id}
                onChange={handleChange}
                required
              >
                <option value="">Sélectionnez un type</option>
                {itemTypes.map(type => (
                  <option key={type.id} value={type.id}>
                    {type.type_name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="mb-3">
              <label htmlFor="quantity" className="form-label">Quantité</label>
              <input
                type="number"
                className="form-control"
                id="quantity"
                name="quantity"
                min="1"
                value={formData.quantity}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="d-flex justify-content-between">
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={() => navigate('/inventory')}
              >
                Annuler
              </button>
              <button type="submit" className="btn btn-primary">
                {isEditing ? 'Enregistrer' : 'Ajouter'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ItemEditor;