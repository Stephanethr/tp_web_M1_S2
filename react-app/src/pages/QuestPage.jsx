import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import QuestsList from '../components/quests/QuestsList';
import QuestsFilter from '../components/quests/QuestsFilter';
import { Tabs, TabList, Tab, TabPanel } from '../components/ui/Tabs';

const QuestsPage = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('available');
  const [filters, setFilters] = useState({
    search: '',
    difficulty: '',
    sort: 'level_asc'
  });

  // Vérifier si l'utilisateur est connecté
  if (!currentUser) {
    navigate('/login');
    return null;
  }

  const handleFilterChange = (newFilters) => {
    setFilters({...filters, ...newFilters});
  };

  return (
    <div className="container mx-auto px-4 py-8 pt-20">
      <Helmet>
        <title>Quêtes | RPG Game</title>
      </Helmet>
      
      <div className="max-w-6xl mx-auto">
        <div className="bg-white shadow-sm rounded-lg p-6">
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h1 className="text-2xl font-bold text-gray-900">Journal de quêtes</h1>
            <QuestsFilter filters={filters} onFilterChange={handleFilterChange} />
          </div>
          
          <Tabs activeTab={activeTab} onChange={(tab) => setActiveTab(tab)}>
            <TabList className="flex border-b border-gray-200 mb-6">
              <Tab id="available" className="py-3 px-4 border-b-2 font-medium text-sm">
                Disponibles
              </Tab>
              <Tab id="active" className="py-3 px-4 border-b-2 font-medium text-sm">
                En cours
              </Tab>
              <Tab id="completed" className="py-3 px-4 border-b-2 font-medium text-sm">
                Complétées
              </Tab>
            </TabList>
            
            <TabPanel id="available">
              <QuestsList type="available" filters={filters} />
            </TabPanel>
            <TabPanel id="active">
              <QuestsList type="active" filters={filters} />
            </TabPanel>
            <TabPanel id="completed">
              <QuestsList type="completed" filters={filters} />
            </TabPanel>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default QuestsPage;
