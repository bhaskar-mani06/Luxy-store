import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-luxury-500 md:hidden"
              >
                <span className="sr-only">Open sidebar</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <div className="flex-shrink-0 flex items-center">
                <span className="text-2xl font-bold text-luxury-600">Admin Panel</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar */}
        <div className={`${isSidebarOpen ? 'block' : 'hidden'} md:block bg-white border-r border-gray-200 w-64 min-h-screen`}>
          <div className="p-4">
            <nav className="space-y-1">
              <Link
                to="/admin/dashboard"
                className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                  location.pathname === '/admin/dashboard'
                    ? 'bg-luxury-100 text-luxury-900'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                Dashboard
              </Link>
              <Link
                to="/admin/products"
                className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                  location.pathname === '/admin/products'
                    ? 'bg-luxury-100 text-luxury-900'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                Products
              </Link>
              <Link
                to="/admin/categories"
                className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                  location.pathname === '/admin/categories'
                    ? 'bg-luxury-100 text-luxury-900'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                Categories
              </Link>
              <Link
                to="/admin/orders"
                className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                  location.pathname === '/admin/orders'
                    ? 'bg-luxury-100 text-luxury-900'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                Orders
              </Link>
              <Link
                to="/admin/users"
                className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                  location.pathname === '/admin/users'
                    ? 'bg-luxury-100 text-luxury-900'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                Users
              </Link>
              <Link
                to="/admin/messages"
                className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                  location.pathname === '/admin/messages'
                    ? 'bg-luxury-100 text-luxury-900'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                Messages
              </Link>
            </nav>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout; 