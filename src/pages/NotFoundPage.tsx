import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full min-h-[calc(100vh-64px)] bg-gray-50 flex flex-col items-center justify-center p-4">
      <img 
        src="/404-error.png" 
        alt="404 Error" 
        className="max-w-md w-full mb-8"
      />
      <button
        onClick={() => navigate('/')}
        className="bg-gold-500 text-white px-8 py-3 rounded-lg hover:bg-gold-600 transition-colors"
      >
        Back to Homepage
      </button>
    </div>
  );
};

export default NotFoundPage; 