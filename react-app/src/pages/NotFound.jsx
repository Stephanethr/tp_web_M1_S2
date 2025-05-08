// src/pages/NotFound.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        <h1 className="text-9xl font-extrabold text-gray-900">404</h1>
        <p className="mt-2 text-3xl font-bold text-gray-900 tracking-tight sm:text-4xl">Page non trouvée</p>
        <p className="mt-2 text-lg text-gray-500">La page que vous recherchez n'existe pas ou a été déplacée.</p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/50"
          >
            Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;