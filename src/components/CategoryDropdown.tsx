import React from 'react';
import { Link } from 'react-router-dom';
import { categories } from '../data/categories';

const CategoryDropdown: React.FC = () => {
  return (
    <div className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-lg p-4 min-w-[200px] z-50 border border-gray-100">
      <ul className="space-y-2">
        {categories.map((category) => (
          <li key={category.id}>
            <Link 
              to={`/category/${category.slug}`}
              className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-gold-500 rounded-md transition-colors duration-200"
            >
              {category.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryDropdown;