import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';

function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
      <div className="text-6xl font-bold text-indigo-600 mb-4">404</div>
      <h1 className="text-3xl font-bold mb-6">Page Not Found</h1>
      <p className="text-xl text-gray-600 max-w-md text-center mb-8">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link to="/">
        <Button size="lg" variant="primary">
          Return Home
        </Button>
      </Link>
    </div>
  );
}

export default NotFoundPage;