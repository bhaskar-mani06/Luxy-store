import React, { useState, useEffect, useRef } from 'react';
import { Plus, Edit2, Trash2, Image as ImageIcon, Upload } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { categories } from '../../data/categories';
import { Product, ProductImage } from '../../types';
import { uploadImages, saveProduct, updateProduct, deleteProduct, fetchProducts, testStorageAccess, fixProductCategories, saveProductImages, fetchProductImages, deleteProductImage, fixAllProductCategories } from '../../lib/supabase';
import { AuthCheck } from '../../components/AuthCheck';
import { useNavigate } from 'react-router-dom';
import { adminSupabase } from '../../lib/supabase';
import { isAdmin } from '../../lib/admin';

const ProductsPage: React.FC = () => {
  const [productList, setProductList] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    category: '',
    imageUrl: '',
    featured: false,
    isNew: false,
    onSale: false,
    discount: ''
  });
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [primaryImageIndex, setPrimaryImageIndex] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  // Load products on component mount
  useEffect(() => {
    loadProducts();
  }, []);

  // Set up real-time subscriptions
  useEffect(() => {
    // Set up real-time subscription for products table
    const productsSubscription = adminSupabase
      .channel('custom-all-channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'products'
        },
        async (payload) => {
          console.log('Real-time update received:', payload);
          await loadProducts();
        }
      )
      .subscribe();

    // Set up real-time subscription for product_images table
    const imagesSubscription = adminSupabase
      .channel('custom-images-channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'product_images'
        },
        async () => {
          await loadProducts();
        }
      )
      .subscribe();

    // Cleanup subscriptions
    return () => {
      productsSubscription.unsubscribe();
      imagesSubscription.unsubscribe();
    };
  }, [refreshKey]);

  const loadProducts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      console.log('Loading products...');
      const products = await fetchProducts();
      console.log('Loaded products:', products);
      setProductList(products);
    } catch (error) {
      console.error('Error loading products:', error);
      setError('Failed to load products. Please try again.');
      toast.error('Failed to load products');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddProduct = () => {
    setSelectedProduct(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      originalPrice: '',
      category: '',
      imageUrl: '',
      featured: false,
      isNew: false,
      onSale: false,
      discount: ''
    });
    setSelectedFiles([]);
    setPreviewUrls([]);
    setPrimaryImageIndex(0);
    setIsModalOpen(true);
  };

  const handleEditProduct = async (product: Product) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      originalPrice: product.originalPrice?.toString() || '',
      category: product.category,
      imageUrl: product.imageUrl,
      featured: product.featured || false,
      isNew: product.isNew || false,
      onSale: product.onSale || false,
      discount: product.discount?.toString() || ''
    });

    try {
      // Fetch all images for this product
      const productImages = await fetchProductImages(product.id);
      
      // Sort images to ensure primary image is first
      const sortedImages = productImages.sort((a, b) => {
        if (a.isPrimary) return -1;
        if (b.isPrimary) return 1;
        return 0;
      });

      // Set preview URLs from all images
      setPreviewUrls(sortedImages.map(img => img.imageUrl));
      setPrimaryImageIndex(sortedImages.findIndex(img => img.isPrimary) || 0);
    } catch (error) {
      console.error('Error fetching product images:', error);
      // Fallback to just the primary image if there's an error
      setPreviewUrls([product.imageUrl]);
      setPrimaryImageIndex(0);
    }

    setSelectedFiles([]);
    setIsModalOpen(true);
  };

  const handleDeleteProduct = async (productId: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        setIsLoading(true);
        await deleteProduct(productId);
        setProductList(prev => prev.filter(p => p.id !== productId));
        toast.success('Product deleted successfully');
      } catch (error) {
        console.error('Error deleting product:', error);
        toast.error('Failed to delete product');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    // Validate number of files
    if (files.length > 5) {
      toast.error('You can upload maximum 5 images');
      return;
    }

    // Validate each file
    const validFiles = files.filter(file => {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} is not an image file`);
        return false;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} is larger than 5MB`);
        return false;
      }

      return true;
    });

    if (validFiles.length === 0) {
      return;
    }

    setSelectedFiles(validFiles);

    // Generate preview URLs
    const newPreviewUrls = validFiles.map(file => URL.createObjectURL(file));
    
    // Clean up old preview URLs
    previewUrls.forEach(url => URL.revokeObjectURL(url));
    
    setPreviewUrls(newPreviewUrls);
    setPrimaryImageIndex(0); // Set first image as primary by default
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Basic validation
      if (!formData.name || !formData.description || !formData.price || !formData.category) {
        toast.error('Please fill in all required fields');
        return;
      }

      if (selectedFiles.length === 0 && previewUrls.length === 0) {
        toast.error('Please select at least one image');
        return;
      }

      console.log('Form submission - Selected category:', formData.category);
      console.log('Category from categories list:', categories.find(cat => cat.slug === formData.category));

      // Upload new images if selected
      let newImageUrls: string[] = [];
      if (selectedFiles.length > 0) {
        console.log('Uploading new images...');
        const uploadResults = await uploadImages(selectedFiles);
        
        const failedUploads = uploadResults.filter(result => !result.success);
        if (failedUploads.length > 0) {
          console.error('Some images failed to upload:', failedUploads);
          toast.error('Some images failed to upload');
          return;
        }

        newImageUrls = uploadResults.map(result => result.url!);
      }

      // Combine existing and new image URLs
      const allImageUrls = [...previewUrls.filter(url => !url.includes('blob:')), ...newImageUrls];

      // Prepare product data
      const productToSave = {
        id: selectedProduct?.id, // Include ID if editing existing product
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
        category: formData.category,
        imageUrl: allImageUrls[primaryImageIndex],
        featured: formData.featured,
        isNew: formData.isNew,
        onSale: Boolean(formData.discount),
        discount: formData.discount ? parseFloat(formData.discount) : 0,
        rating: selectedProduct?.rating || 0
      };

      console.log('Saving product with data:', productToSave);
      
      // Save or update product
      const saveResult = await saveProduct(productToSave);
      
      if (!saveResult.success || !saveResult.data) {
        console.error('Failed to save product:', saveResult.error);
        toast.error(`Failed to save product: ${saveResult.error}`);
        return;
      }

      console.log('Product saved successfully:', saveResult.data);
      console.log('Saved product category:', saveResult.data.category);

      // Save product images
      if (allImageUrls.length > 0) {
        const imagesResult = await saveProductImages(
          saveResult.data.id,
          allImageUrls,
          primaryImageIndex
        );

        if (!imagesResult.success) {
          console.error('Failed to save product images:', imagesResult.error);
          toast.error('Failed to save some product images');
        }
      }

      toast.success(selectedProduct ? 'Product updated successfully!' : 'Product saved successfully!');
      setIsModalOpen(false);
      await loadProducts(); // Reload products after saving
    } catch (error) {
      console.error('Error in form submission:', error);
      toast.error('Failed to save product');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestStorage = async () => {
    try {
      const result = await testStorageAccess();
      if (result.success) {
        toast.success('Storage access test successful');
        console.log('Storage test results:', result);
      } else {
        toast.error('Storage access test failed');
        console.error('Storage test error:', result.error);
      }
    } catch (error) {
      toast.error('Storage test failed');
      console.error('Storage test error:', error);
    }
  };

  // Add a refresh function
  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-luxury-500">Products</h1>
        <div className="flex gap-3">
          <button
            onClick={handleRefresh}
            className="px-4 py-2 bg-white text-luxury-600 border border-luxury-600 rounded-md hover:bg-luxury-50 transition-colors flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
          <button
            onClick={handleAddProduct}
            className="px-4 py-2 bg-luxury-600 text-white rounded-md hover:bg-luxury-700 transition-colors flex items-center"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Product
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="min-h-screen flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-luxury-600 mb-4"></div>
            <p className="text-luxury-600">Loading products...</p>
          </div>
        </div>
      ) : productList.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="text-gray-500 mb-4">No products found</div>
          <button
            onClick={handleAddProduct}
            className="inline-flex items-center px-4 py-2 bg-luxury-600 text-white rounded-md hover:bg-luxury-700 transition-colors"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Your First Product
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                    Image
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {productList.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="h-16 w-16 object-cover rounded-lg shadow-sm"
                        onError={(e) => {
                          const img = e.target as HTMLImageElement;
                          img.src = '/placeholder.png'; // Add a placeholder image
                        }}
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-900">{product.name}</span>
                        <span className="text-sm text-gray-500">{product.description?.substring(0, 50)}...</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 inline-flex text-sm leading-5 font-medium rounded-full bg-gray-100 text-gray-800">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-900">₹{product.price}</span>
                        {product.originalPrice && (
                          <span className="text-xs text-gray-500 line-through">₹{product.originalPrice}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-2">
                        {product.onSale && (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                            Sale
                          </span>
                        )}
                        {product.featured && (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gold-100 text-gold-800">
                            Featured
                          </span>
                        )}
                        {product.isNew && (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            New
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-3">
                        <button
                          onClick={() => handleEditProduct(product)}
                          className="text-luxury-600 hover:text-luxury-900 transition-colors"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="text-red-600 hover:text-red-900 transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 my-8">
            <div className="p-4 border-b flex justify-between items-center sticky top-0 bg-white">
              <h2 className="text-xl font-semibold">
                {selectedProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Column 1: Basic Info */}
                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold-500"
                      placeholder="Enter product name"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                      Category *
                    </label>
                    <select
                      id="category"
                      value={formData.category}
                      onChange={(e) => {
                        console.log('Selected category:', e.target.value);
                        setFormData(prev => ({ ...prev, category: e.target.value }));
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold-500"
                      required
                    >
                      <option value="">Select a category</option>
                      {categories.map(category => (
                        <option key={category.id} value={category.slug}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                      Description *
                    </label>
                    <textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold-500"
                      placeholder="Enter product description"
                      rows={3}
                      required
                    />
                  </div>
                </div>

                {/* Column 2: Pricing & Status */}
                <div className="space-y-4">
                  <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                      Price (₹) *
                    </label>
                    <input
                      type="number"
                      id="price"
                      value={formData.price}
                      onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold-500"
                      placeholder="Enter price"
                      required
                      min="0"
                      step="0.01"
                    />
                  </div>

                  <div>
                    <label htmlFor="originalPrice" className="block text-sm font-medium text-gray-700">
                      Original Price (₹)
                    </label>
                    <input
                      type="number"
                      id="originalPrice"
                      value={formData.originalPrice}
                      onChange={(e) => setFormData(prev => ({ ...prev, originalPrice: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold-500"
                      placeholder="Enter original price"
                      min="0"
                      step="0.01"
                    />
                  </div>

                  <div>
                    <label htmlFor="discount" className="block text-sm font-medium text-gray-700">
                      Discount (%)
                    </label>
                    <input
                      type="number"
                      id="discount"
                      value={formData.discount}
                      onChange={(e) => setFormData(prev => ({ ...prev, discount: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold-500"
                      placeholder="Enter discount"
                      min="0"
                      max="100"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.featured}
                        onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                        className="rounded text-gold-500 focus:ring-gold-500"
                      />
                      <span className="text-sm text-gray-700">Featured Product</span>
                    </label>

                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.isNew}
                        onChange={(e) => setFormData(prev => ({ ...prev, isNew: e.target.checked }))}
                        className="rounded text-gold-500 focus:ring-gold-500"
                      />
                      <span className="text-sm text-gray-700">New Arrival</span>
                    </label>

                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.onSale}
                        onChange={(e) => setFormData(prev => ({ ...prev, onSale: e.target.checked }))}
                        className="rounded text-gold-500 focus:ring-gold-500"
                      />
                      <span className="text-sm text-gray-700">On Sale</span>
                    </label>
                  </div>
                </div>

                {/* Column 3: Images */}
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Product Images * (Max 5)
                  </label>
                  <div className="flex flex-col space-y-4">
                    <div className="flex-1">
                      <div className="flex items-center justify-center w-full">
                        <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                          <div className="flex flex-col items-center justify-center p-2">
                            <Upload className="w-6 h-6 mb-1 text-gray-500" />
                            <p className="text-xs text-gray-500">
                              <span className="font-semibold">Click to upload</span> or drag and drop
                            </p>
                            <p className="text-xs text-gray-500">PNG, JPG or JPEG (max. 5MB each)</p>
                          </div>
                          <input
                            ref={fileInputRef}
                            type="file"
                            className="hidden"
                            accept="image/*"
                            multiple
                            onChange={handleFileChange}
                          />
                        </label>
                      </div>
                    </div>

                    {previewUrls.length > 0 && (
                      <div className="grid grid-cols-2 gap-2">
                        {previewUrls.map((url, index) => (
                          <div key={index} className="relative">
                            <div className={`relative w-full aspect-square rounded-lg overflow-hidden border-2 ${
                              index === primaryImageIndex ? 'border-gold-500' : 'border-transparent'
                            }`}>
                              <img
                                src={url}
                                alt={`Preview ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const newUrls = [...previewUrls];
                                  const newFiles = [...selectedFiles];
                                  newUrls.splice(index, 1);
                                  newFiles.splice(index, 1);
                                  URL.revokeObjectURL(url);
                                  setPreviewUrls(newUrls);
                                  setSelectedFiles(newFiles);
                                  if (primaryImageIndex >= newUrls.length) {
                                    setPrimaryImageIndex(Math.max(0, newUrls.length - 1));
                                  }
                                }}
                                className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                            <button
                              type="button"
                              onClick={() => setPrimaryImageIndex(index)}
                              className={`mt-1 text-xs w-full text-center py-1 rounded ${
                                index === primaryImageIndex
                                  ? 'bg-gold-500 text-white'
                                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                              }`}
                            >
                              {index === primaryImageIndex ? 'Primary' : 'Set as Primary'}
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-4 flex justify-end gap-2">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={isLoading}
                >
                  {isLoading ? 'Saving...' : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsPage; 