import React from 'react';

const ClassSelection = ({ classes, selectedClass, onSelectClass }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {classes.map((characterClass) => (
        <div
          key={characterClass.id}
          className={`relative rounded-lg border-2 p-4 cursor-pointer transition-all duration-200 overflow-hidden ${
            selectedClass === characterClass.id
              ? 'bg-primary-50 border-primary-500 shadow-lg'
              : 'bg-white border-gray-200 hover:border-primary-300 hover:shadow-md'
          }`}
          onClick={() => onSelectClass(characterClass.id)}
        >
          <div className="relative z-10">
            <h3 className="text-lg font-bold text-gray-900">{characterClass.name}</h3>
            <p className="mt-1 text-sm text-gray-500">{characterClass.description}</p>
            
            <div className="mt-4 p-2 bg-white bg-opacity-60 rounded border border-gray-200">
              <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wide">Caractéristiques</h4>
              <p className="text-sm text-gray-600">{characterClass.stats}</p>
            </div>
          </div>
          
          {/* Image en arrière-plan */}
          <div className="absolute bottom-0 right-0 opacity-10">
            {characterClass.id === 'warrior' && (
              <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 24 24" fill="currentColor" className="text-red-800">
                <path d="M14.5 12.5l.414-1.5H16V9.5l1-1V7h.5A1.5 1.5 0 0019 5.5V3h-1v2.5a.5.5 0 01-.5.5H17V5h-1v1H7V5H6v1h-.5a.5.5 0 01-.5-.5V3H4v2.5A1.5 1.5 0 005.5 7H6v1.5l1 1V11h1.086l.414 1.5L9.25 14l-1.75.75L7 16h10l-.5-1.25L14.75 14l.75-1.5zm-9.085 9.5c.713 0 1.75-.367 2.5-1.312.75.945 1.787 1.312 2.5 1.312h2.17c.712 0 1.75-.367 2.5-1.312.75.945 1.787 1.312 2.5 1.312H20V21h-2.585c-.712 0-1.75-.367-2.5-1.312-.616.775-1.415 1.094-2.085 1.266V22h-2v-1.046c-.67-.173-1.469-.49-2.085-1.266-.75.945-1.787 1.312-2.5 1.312H4v-1h1.415z"/>
              </svg>
            )}
            {characterClass.id === 'mage' && (
              <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 24 24" fill="currentColor" className="text-blue-700">
                <path d="M19.725 10a9.003 9.003 0 00-9-9c-4.19 0-7.9 2.888-8.883 7.062A6 6 0 007 20h10a6 6 0 002.725-10zm.275 4a4.002 4.002 0 01-3 3.874V18h-2v-2h-4v2H9v-2H7v-2h2v-2h2v2h4v-2h2v2h2v2h-2v-1.126c1.725-.444 3-2.01 3-3.874a4 4 0 00-4-4h-.142A7.002 7.002 0 0012.142 3c3.297 0 6.056 2.245 6.862 5.285A3.996 3.996 0 0120 14z"/>
              </svg>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ClassSelection;
