import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Package } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { categories } from '../../data/categories';
import { products } from '../../data/products';
import { Category } from '../../types';
import FixCategoriesButton from '../../components/admin/FixCategoriesButton';

const CategoriesPage: React.FC = () => {
  const [categoryList, setCategoryList] = useState<Category[]>(categories);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: ''
  });

  const handleAddCategory = () => {
    setSelectedCategory(null);
    setFormData({
      name: '',
      slug: '',
      description: ''
    });
    setIsModalOpen(true);
  };

  const handleEditCategory = (category: Category) => {
    setSelectedCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || ''
    });
    setIsModalOpen(true);
  };

  const handleDeleteCategory = (categoryId: number) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      // TODO: Implement actual deletion with backend
      setCategoryList(prev => prev.filter(cat => cat.id !== categoryId));
      toast.success('Category deleted successfully');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name || !formData.slug) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (selectedCategory) {
      // Update existing category
      setCategoryList(prev => prev.map(cat => 
        cat.id === selectedCategory.id 
          ? { ...cat, ...formData }
          : cat
      ));
      toast.success('Category updated successfully');
    } else {
      // Add new category
      const newCategory: Category = {
        id: Math.max(...categoryList.map(c => c.id)) + 1,
        ...formData
      };
      setCategoryList(prev => [...prev, newCategory]);
      toast.success('Category added successfully');
    }

    setIsModalOpen(false);
  };

  const getProductsInCategory = (categorySlug: string) => {
    return products.filter(product => product.category === categorySlug);
  };

  return (
    <div className="pt-24 pb-6 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Categories</h1>
          <div className="flex gap-4">
            <FixCategoriesButton />
            <button
              onClick={handleAddCategory}
              className="btn-primary flex items-center gap-2"
            >
              <Plus size={20} />
              Add Category
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categoryList.map(category => (
            <div key={category.id} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
                  <p className="text-sm text-gray-500">{category.slug}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditCategory(category)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                    title="Edit Category"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(category.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                    title="Delete Category"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              {category.description && (
                <p className="text-sm text-gray-600 mb-4">{category.description}</p>
              )}

              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Package size={16} />
                <span>{getProductsInCategory(category.slug).length} products</span>
              </div>
            </div>
          ))}
        </div>

        {/* Category Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-semibold mb-4">
                {selectedCategory ? 'Edit Category' : 'Add Category'}
              </h2>
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gold-500 focus:ring-gold-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Slug</label>
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={e => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gold-500 focus:ring-gold-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gold-500 focus:ring-gold-500"
                    />
                  </div>
                </div>
                <div className="mt-6 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-gray-700 hover:text-gray-900"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-gold-500 text-white rounded hover:bg-gold-600"
                  >
                    {selectedCategory ? 'Update' : 'Add'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoriesPage; 