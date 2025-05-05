import React from 'react';
import QuestCard from './QuestCard';

function QuestsList({ quests, onStartQuest, loading }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {quests.map(quest => (
        <QuestCard 
          key={quest.id}
          quest={quest}
          onStartQuest={onStartQuest}
          disabled={loading}
        />
      ))}
      
      {quests.length === 0 && (
        <div className="col-span-full text-center py-10">
          <p className="text-gray-600">No quests available right now. Check back later!</p>
        </div>
      )}
    </div>
  );
}

export default QuestsList;