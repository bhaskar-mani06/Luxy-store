import React from 'react';

const DashboardPage: React.FC = () => {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-luxury-500 mb-8">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Stats Cards */}
        <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 border border-gray-100">
          <h2 className="text-lg font-semibold mb-2 text-luxury-500">Total Users</h2>
          <p className="text-3xl font-bold text-gold-500">0</p>
        </div>

        <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 border border-gray-100">
          <h2 className="text-lg font-semibold mb-2 text-luxury-500">Total Products</h2>
          <p className="text-3xl font-bold text-gold-500">0</p>
        </div>

        <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 border border-gray-100">
          <h2 className="text-lg font-semibold mb-2 text-luxury-500">Total Orders</h2>
          <p className="text-3xl font-bold text-gold-500">0</p>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4 text-luxury-500">Recent Activity</h2>
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
          <p className="text-gray-600">No recent activity</p>
        </div>
      </div>

      {/* Quick Actions Section */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4 text-luxury-500">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <button className="bg-gold-500 hover:bg-gold-600 text-white p-4 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg">
            Add New Product
          </button>
          <button className="bg-luxury-500 hover:bg-luxury-600 text-white p-4 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg">
            View Orders
          </button>
          <button className="bg-white hover:bg-gray-50 text-luxury-500 p-4 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg border border-gray-200">
            Manage Categories
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage; 