import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between">
          <div className="mb-4 md:mb-0">
            <h3 className="text-lg font-bold mb-2">RPG Game</h3>
            <p className="text-gray-400">Votre aventure commence ici</p>
          </div>
          <div>
            <h4 className="text-md font-semibold mb-2">Liens utiles</h4>
            <ul className="space-y-1">
              <li>
                <a href="#" className="text-gray-400 hover:text-white">À propos</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white">Conditions d'utilisation</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white">Politique de confidentialité</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-4 border-t border-gray-700 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} RPG Game. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
