import React, { useState, useEffect, useRef } from 'react';
import { Image as ImageIcon, Search, X, ToggleLeft, ToggleRight, Save } from 'lucide-react';
import instance, { getImageUrl } from '../../web/api/AxiosConfig';

const Offerbanner = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showProductDropdown, setShowProductDropdown] = useState(false);
  const [productSearch, setProductSearch] = useState('');
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const productDropdownRef = useRef(null);

  const [formData, setFormData] = useState({
    type: 'offerBanner',
    title: '',
    description: '',
    image: null,
    existingImage: '',
    productId: null,
    selectedProduct: null,
    ctaText: 'Shop Now',
    status: true
  });

  useEffect(() => {
    fetchOfferContent();
    window.scrollTo(0, 0);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (productDropdownRef.current && !productDropdownRef.current.contains(event.target)) {
        setShowProductDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter products when search changes
  useEffect(() => {
    if (productSearch.trim()) {
      const searchLower = productSearch.toLowerCase();
      const filtered = allProducts.filter(p => 
        p.name.toLowerCase().includes(searchLower) ||
        p.category?.name?.toLowerCase().includes(searchLower)
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(allProducts.slice(0, 20));
    }
  }, [productSearch, allProducts]);

  const getAuthHeader = () => {
    const token = localStorage.getItem('adminToken');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const fetchOfferContent = async () => {
    try {
      const res = await instance.get('/api/offer-content/type/offerBanner', { headers: getAuthHeader() });
      if (res.data.success && res.data.data) {
        const data = res.data.data;
        setFormData({
          ...formData,
          type: 'offerBanner',
          title: data.title || '',
          description: data.description || '',
          existingImage: data.image || '',
          productId: data.productId?._id || null,
          selectedProduct: data.productId || null,
          ctaText: data.ctaText || 'Shop Now',
          status: data.status !== false
        });
      }
    } catch (err) {
      console.error('Error fetching offer content:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllProducts = async () => {
    if (allProducts.length > 0) return;
    setLoadingProducts(true);
    try {
      const res = await instance.get('/api/products', { headers: getAuthHeader() });
      if (res.data.success) {
        setAllProducts(res.data.data);
        setFilteredProducts(res.data.data.slice(0, 20));
      }
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setLoadingProducts(false);
    }
  };

  const handleProductSearch = (e) => {
    setProductSearch(e.target.value);
    setShowProductDropdown(true);
    fetchAllProducts();
  };

  const selectProduct = (product) => {
    setFormData({
      ...formData,
      productId: product._id,
      selectedProduct: product
    });
    setProductSearch('');
    setShowProductDropdown(false);
  };

  const removeProduct = () => {
    setFormData({
      ...formData,
      productId: null,
      selectedProduct: null
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = new FormData();
      data.append('type', 'offerBanner');
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('ctaText', formData.ctaText);
      data.append('status', formData.status);
      if (formData.productId) {
        data.append('productId', formData.productId);
      }
      if (formData.image) {
        data.append('image', formData.image);
      }

      const headers = { 
        ...getAuthHeader(),
        'Content-Type': 'multipart/form-data' 
      };

      const res = await instance.post('/api/offer-content', data, { headers });
      if (res.data.success) {
        alert('Offer Banner saved successfully!');
        fetchOfferContent();
      }
    } catch (err) {
      console.error('Error saving offer:', err);
      alert('Error saving offer content');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Offer Banner</h1>
        <p className="text-gray-500 text-sm mb-6">Manage the banner shown in Shop By Concern page</p>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl border p-6">
          {/* Title */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Natural Ayurvedic Wellness"
              required
            />
          </div>

          {/* Description */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Pure herbal solutions for immunity, skin care, hair growth & complete daily health."
              rows={3}
            />
          </div>

          {/* CTA Text */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Button Text</label>
            <input
              type="text"
              value={formData.ctaText}
              onChange={(e) => setFormData({ ...formData, ctaText: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Shop Now"
            />
          </div>

          {/* Image */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Banner Image</label>
            <div className="flex items-center gap-4">
              <div className="w-40 h-24 border-2 border-dashed rounded-lg flex items-center justify-center overflow-hidden bg-gray-50">
                {formData.image ? (
                  <img src={URL.createObjectURL(formData.image)} alt="Preview" className="w-full h-full object-cover" />
                ) : formData.existingImage ? (
                  <img src={getImageUrl(formData.existingImage)} alt="Existing" className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon className="text-gray-400" size={32} />
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
                className="text-sm text-gray-500"
              />
            </div>
          </div>

          {/* Product Selection */}
          <div className="mb-4" ref={productDropdownRef}>
            <label className="block text-sm font-medium text-gray-700 mb-1">Link to Product (Optional)</label>
            
            {formData.selectedProduct ? (
              <div className="flex items-center gap-3 p-3 border rounded-lg bg-gray-50">
                <img
                  src={formData.selectedProduct.images?.[0] ? getImageUrl(formData.selectedProduct.images[0]) : '/placeholder.jpg'}
                  alt={formData.selectedProduct.name}
                  className="w-12 h-12 object-cover rounded"
                />
                <div className="flex-1">
                  <p className="text-sm font-medium">{formData.selectedProduct.name}</p>
                  <p className="text-xs text-gray-500">₹{formData.selectedProduct.selling_price || formData.selectedProduct.unitPrice || 0}</p>
                </div>
                <button
                  type="button"
                  onClick={removeProduct}
                  className="text-red-500 hover:text-red-700"
                >
                  <X size={20} />
                </button>
              </div>
            ) : (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  value={productSearch}
                  onChange={handleProductSearch}
                  onFocus={() => {
                    setShowProductDropdown(true);
                    fetchAllProducts();
                  }}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Search products by name..."
                />
                
                {showProductDropdown && (
                  <div className="mt-2 border rounded-lg max-h-64 overflow-y-auto bg-white shadow-lg absolute z-10 w-full">
                    {loadingProducts ? (
                      <div className="p-4 text-center text-gray-500">Loading products...</div>
                    ) : filteredProducts.length > 0 ? (
                      filteredProducts.map((product) => (
                        <div
                          key={product._id}
                          onClick={() => selectProduct(product)}
                          className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                        >
                          <img
                            src={product.images?.[0] ? getImageUrl(product.images[0]) : '/placeholder.jpg'}
                            alt={product.name}
                            className="w-10 h-10 object-cover rounded"
                          />
                          <div className="flex-1">
                            <p className="text-sm font-medium">{product.name}</p>
                            <p className="text-xs text-gray-500">₹{product.unitPrice || product.selling_price || 0}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-gray-500">No products found</div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Status */}
          <div className="mb-6 flex items-center gap-2">
            <input
              type="checkbox"
              id="status"
              checked={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.checked })}
              className="w-4 h-4 text-blue-600"
            />
            <label htmlFor="status" className="text-sm font-medium text-gray-700">Active</label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={saving}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Saving...
              </>
            ) : (
              <>
                <Save size={20} /> Save Offer Banner
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Offerbanner;
