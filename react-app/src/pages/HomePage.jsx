import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import useCharacter from '../hooks/useCharacter';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Loading from '../components/common/Loading';

function HomePage() {
  const { currentUser } = useAuth();
  const { activeCharacter, characters, loading, getCharacters } = useCharacter();

  useEffect(() => {
    getCharacters();
  }, [getCharacters]);

  if (loading) return <Loading />;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-4">Welcome to RPG Game</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Embark on an epic adventure, create powerful characters, battle fearsome monsters,
          and collect legendary treasures!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {/* Character Section */}
        <Card>
          <div className="flex flex-col items-center">
            <div className="bg-indigo-100 p-4 rounded-full mb-4">
              <svg className="h-10 w-10 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold mb-2">Characters</h2>
            <p className="text-gray-600 text-center mb-4">
              {characters.length > 0
                ? `You have ${characters.length} character${characters.length > 1 ? 's' : ''}`
                : "You don't have any characters yet"}
            </p>
            <Link to="/characters" className="w-full">
              <Button fullWidth variant="primary">
                {characters.length > 0 ? "View Characters" : "Create Character"}
              </Button>
            </Link>
          </div>
        </Card>

        {/* Quests Section */}
        <Card>
          <div className="flex flex-col items-center">
            <div className="bg-green-100 p-4 rounded-full mb-4">
              <svg className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold mb-2">Quests</h2>
            <p className="text-gray-600 text-center mb-4">
              {activeCharacter 
                ? "Embark on adventures and earn rewards" 
                : "Select a character to start questing"}
            </p>
            <Link to="/quests" className="w-full">
              <Button 
                fullWidth 
                variant="primary" 
                disabled={!activeCharacter}
              >
                View Quests
              </Button>
            </Link>
          </div>
        </Card>

        {/* Battle Section */}
        <Card>
          <div className="flex flex-col items-center">
            <div className="bg-red-100 p-4 rounded-full mb-4">
              <svg className="h-10 w-10 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold mb-2">Battle Arena</h2>
            <p className="text-gray-600 text-center mb-4">
              {characters.length > 1 
                ? "Pit your characters against each other" 
                : "Create at least 2 characters to battle"
              }
            </p>
            <Link to="/versus" className="w-full">
              <Button 
                fullWidth 
                variant="primary" 
                disabled={characters.length < 2}
              >
                Enter Arena
              </Button>
            </Link>
          </div>
        </Card>
      </div>

      {/* Board Game Section */}
      <div className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg p-6 shadow-lg">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="mb-4 md:mb-0 md:mr-6">
            <h2 className="text-2xl font-bold mb-2">Board Game Adventure</h2>
            <p className="max-w-xl">
              A unique tabletop-inspired experience. Navigate your character through a series of challenges, 
              battle monsters, and collect treasures to complete the journey!
            </p>
          </div>
          <Link to="/board-game">
            <Button variant="light">
              Play Now
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default HomePage;