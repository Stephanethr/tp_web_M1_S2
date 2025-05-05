import React, { useState } from 'react';
import Button from '../common/Button';
import Card from '../common/Card';

const RACES = ['human', 'elf', 'dwarf', 'orc'];
const CLASSES = ['warrior', 'mage'];

function CreateCharacterForm({ onSubmit, error }) {
  const [formData, setFormData] = useState({
    name: '',
    race: 'human',
    class: 'warrior'
  });
  
  const [validationErrors, setValidationErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const errors = {};
    
    if (formData.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters';
    }
    
    if (!RACES.includes(formData.race)) {
      errors.race = 'Please select a valid race';
    }
    
    if (!CLASSES.includes(formData.class)) {
      errors.class = 'Please select a valid class';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        {error && (
          <div className="bg-red-100 p-4 rounded-md text-red-700 mb-4">
            {error}
          </div>
        )}
        
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Character Name
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
            placeholder="Enter a name for your character"
          />
          {validationErrors.name && (
            <p className="mt-1 text-sm text-red-600">{validationErrors.name}</p>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="race" className="block text-sm font-medium text-gray-700 mb-1">
            Race
          </label>
          <select
            id="race"
            name="race"
            value={formData.race}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
              validationErrors.race ? 'border-red-300' : 'border-gray-300'
            }`}
          >
            {RACES.map(race => (
              <option key={race} value={race} className="capitalize">
                {race.charAt(0).toUpperCase() + race.slice(1)}
              </option>
            ))}
          </select>
          {validationErrors.race && (
            <p className="mt-1 text-sm text-red-600">{validationErrors.race}</p>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="class" className="block text-sm font-medium text-gray-700 mb-1">
            Class
          </label>
          <div className="grid grid-cols-2 gap-4">
            {CLASSES.map(charClass => (
              <div key={charClass} className="relative">
                <input
                  type="radio"
                  id={charClass}
                  name="class"
                  value={charClass}
                  checked={formData.class === charClass}
                  onChange={handleChange}
                  className="sr-only"
                />
                <label
                  htmlFor={charClass}
                  className={`block p-4 border rounded-lg text-center cursor-pointer transition-colors ${
                    formData.class === charClass
                      ? 'bg-indigo-100 border-indigo-500'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-2xl block mb-2">
                    {charClass === 'warrior' ? '⚔️' : '🧙'}
                  </span>
                  <span className="font-medium capitalize">
                    {charClass}
                  </span>
                </label>
              </div>
            ))}
          </div>
          {validationErrors.class && (
            <p className="mt-1 text-sm text-red-600">{validationErrors.class}</p>
          )}
        </div>

        <div className="flex justify-end">
          <Button type="submit">Create Character</Button>
        </div>
      </form>
    </Card>
  );
}

export default CreateCharacterForm;