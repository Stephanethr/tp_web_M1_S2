import React from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import InventoryList from '../components/inventory/InventoryList';

const InventoryPage = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // Vérifier si l'utilisateur est connecté
  if (!currentUser) {
    navigate('/login');
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8 pt-20">
      <Helmet>
        <title>Inventaire | RPG Game</title>
      </Helmet>
      
      <div className="max-w-6xl mx-auto">
        <div className="bg-white shadow-sm rounded-lg p-6">
          <InventoryList />
        </div>
      </div>
    </div>
  );
};

export default InventoryPage;
