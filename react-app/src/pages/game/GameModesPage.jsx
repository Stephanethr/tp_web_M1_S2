import { Link } from 'react-router-dom';

const GameModesPage = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-8">
    <div className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow">
      <h2 className="text-2xl font-bold mb-4 text-blue-600">Mode Versus</h2>
      <p className="mb-4">Affrontez un autre joueur en combat tour par tour</p>
      <Link 
        to="/game/versus" 
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
      >
        Jouer
      </Link>
    </div>

    <div className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow">
      <h2 className="text-2xl font-bold mb-4 text-green-600">Mode Quête</h2>
      <p className="mb-4">Partez à l'aventure dans des quêtes solo ou coopératives</p>
      <Link 
        to="/game/quests" 
        className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
      >
        Explorer
      </Link>
    </div>

    <div className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow">
      <h2 className="text-2xl font-bold mb-4 text-purple-600">Jeu de Plateau</h2>
      <p className="mb-4">Stratégie en temps réel sur une carte dynamique</p>
      <Link 
        to="/game/board" 
        className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded"
      >
        Commencer
      </Link>
    </div>
  </div>
);

export default GameModesPage;