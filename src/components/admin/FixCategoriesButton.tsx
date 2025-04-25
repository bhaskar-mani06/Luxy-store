import React, { useState } from 'react';
import { toast } from 'react-hot-toast';

const FixCategoriesButton: React.FC = () => {
  const [isFixing, setIsFixing] = useState(false);

  const handleFixCategories = async () => {
    try {
      setIsFixing(true);
      const response = await fetch('/api/fix-categories', {
        method: 'POST',
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success('Categories fixed successfully');
      } else {
        toast.error('Failed to fix categories');
      }
    } catch (error) {
      console.error('Error fixing categories:', error);
      toast.error('Failed to fix categories');
    } finally {
      setIsFixing(false);
    }
  };

  return (
    <button
      onClick={handleFixCategories}
      disabled={isFixing}
      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
    >
      {isFixing ? 'Fixing Categories...' : 'Fix Categories'}
    </button>
  );
};

export default FixCategoriesButton; 