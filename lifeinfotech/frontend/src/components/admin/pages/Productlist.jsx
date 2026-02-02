import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Filter, Star, Eye, Edit, Trash2, ChevronLeft, ChevronRight, RefreshCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProductList = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const API_BASE = "http://localhost:5000";

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [prodRes, catRes] = await Promise.all([
        axios.get(`${API_BASE}/api/products`),
        axios.get(`${API_BASE}/api/categories`)
      ]);

      // Backend response structure handle karna
      const allProds = prodRes.data.data || prodRes.data.products || [];
      const allCats = catRes.data.categories || catRes.data.data || catRes.data || [];

      setProducts(allProds);
      setCategories(allCats);
      setLoading(false);
    } catch (error) {
      console.error("Fetch Error:", error);
      setLoading(false);
    }
  };

  const toggleBestseller = async (id, currentStatus) => {
    try {
      const token = localStorage.getItem('adminToken');
      await axios.put(`${API_BASE}/api/products/${id}/bestseller`, {}, 
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      setProducts(prev => prev.map(p => p._id === id ? { ...p, is_bestseller: !currentStatus } : p));
    } catch (error) {
      alert("Status update failed!");
    }
  };

  // --- FINAL FILTER LOGIC (SUPER STICKY) ---
  const filteredProducts = products.filter(p => {
    // 1. Search by Name
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    // 2. Search by Category
    if (!selectedCategory || selectedCategory === '') return matchesSearch;

    const prodCatId = p.category_id?._id || p.category_id;
    // Donon IDs ko string mein convert karke trim karke compare karein
    const matchesCategory = String(prodCatId).trim() === String(selectedCategory).trim();
    
    return matchesSearch && matchesCategory;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const currentItems = filteredProducts.slice(indexOfLastItem - itemsPerPage, indexOfLastItem);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;

  return (
    <div className="p-6 md:p-10 bg-slate-900 min-h-screen text-white font-sans">
      
      {/* Header */}
      <div className="mb-10 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black italic uppercase text-blue-500 tracking-tighter">Master Inventory</h1>
          <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em] mt-1">Lebrostone Production Database</p>
        </div>
        <button 
          onClick={() => { setSearchTerm(''); setSelectedCategory(''); fetchInitialData(); }}
          className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white bg-slate-800 px-4 py-2 rounded-xl transition-all"
        >
          <RefreshCcw size={14} /> Reset Filters
        </button>
      </div>

      {/* Dual Search & Filter */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-6">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input 
            type="text" 
            placeholder="Search by name..." 
            value={searchTerm}
            className="w-full bg-slate-800 border border-slate-700 px-12 py-4 rounded-2xl outline-none focus:border-blue-500 font-bold transition-all shadow-lg"
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
          />
        </div>

        <div className="relative w-full md:w-72">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <select 
            className="w-full bg-slate-800 border border-slate-700 pl-12 pr-6 py-4 rounded-2xl outline-none appearance-none font-bold text-sm text-slate-300 cursor-pointer focus:border-blue-500 shadow-lg"
            value={selectedCategory}
            onChange={(e) => { setSelectedCategory(e.target.value); setCurrentPage(1); }}
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat._id} value={cat._id}>{cat.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table Content */}
      <div className="bg-slate-800 rounded-[3rem] border border-slate-700 shadow-2xl overflow-hidden overflow-x-auto">
        <table className="w-full text-left min-w-[1000px]">
          <thead className="bg-slate-700/50 text-[11px] uppercase text-slate-400 font-black tracking-widest border-b border-slate-700">
            <tr>
              <th className="p-8">Visual & Product Name</th>
              <th className="p-8 text-center">Bestseller Status</th>
              <th className="p-8">Pricing (PDF Format)</th>
              <th className="p-8 text-right pr-12">Action Control</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/50">
            {loading ? (
              <tr><td colSpan="4" className="p-24 text-center font-black text-slate-600 uppercase italic tracking-widest animate-pulse">Syncing Lebrostone Database...</td></tr>
            ) : currentItems.length === 0 ? (
              <tr><td colSpan="4" className="p-24 text-center font-black text-slate-500 uppercase tracking-widest">No matching products found in this category</td></tr>
            ) : currentItems.map((prod) => (
              <tr key={prod._id} className="hover:bg-slate-700/20 transition-all group">
                <td className="p-8 flex items-center gap-6">
                  <div className="relative">
                    <img src={prod.images?.[0] || 'https://via.placeholder.com/150'} className="w-16 h-16 rounded-[1.2rem] object-cover border-2 border-slate-700 group-hover:border-blue-500 shadow-lg" alt="" />
                    {prod.is_bestseller && (
                      <div className="absolute -top-2 -right-2 bg-yellow-500 p-1.5 rounded-full shadow-lg border-2 border-slate-800">
                        <Star size={10} fill="black" />
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="font-black text-slate-100 uppercase text-lg leading-tight tracking-tight">{prod.name}</div>
                    <div className="text-[10px] text-blue-500 font-bold uppercase mt-1 tracking-tighter">
                        Category: {prod.category_id?.name || 'Unmapped'}
                    </div>
                  </div>
                </td>
                <td className="p-8 text-center">
                  <button 
                    onClick={() => toggleBestseller(prod._id, prod.is_bestseller)}
                    className={`px-6 py-2.5 rounded-full text-[10px] font-black tracking-widest transition-all ${prod.is_bestseller ? 'bg-yellow-500 text-black shadow-[0_0_20px_rgba(234,179,8,0.3)]' : 'bg-slate-700 text-slate-400 hover:bg-slate-600'}`}
                  >
                    {prod.is_bestseller ? '★ ACTIVE BESTSELLER' : 'MARK BESTSELLER'}
                  </button>
                </td>
                <td className="p-8">
                  <div className="text-2xl font-black text-emerald-400 italic leading-none">₹{prod.variants?.[0]?.selling_price || '0'}</div>
                  <div className="text-[10px] text-slate-500 font-bold uppercase mt-1 tracking-widest">{prod.variants?.[0]?.size || 'Std'} Pack Size</div>
                </td>
                <td className="p-8 text-right pr-12">
                  <div className="flex justify-end gap-4">
                   <button 
    onClick={() => navigate(`/admin/product/view/${prod._id}`)} 
    className="p-4 bg-slate-900 rounded-2xl text-blue-400 hover:bg-blue-600 hover:text-white transition-all border border-slate-700"
>
    <Eye size={18} />
</button>
                    
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="mt-10 flex flex-col md:flex-row justify-between items-center px-10 gap-6">
        <p className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">Showing {currentItems.length} of {filteredProducts.length} Results Found</p>
        <div className="flex gap-4 items-center bg-slate-800 p-2 rounded-3xl border border-slate-700 shadow-inner">
           <button 
             disabled={currentPage === 1} 
             onClick={() => setCurrentPage(p => p - 1)} 
             className="p-3 bg-slate-900 rounded-2xl disabled:opacity-20 text-blue-500 hover:bg-slate-700 transition-all"
           >
             <ChevronLeft size={20}/>
           </button>
           <span className="text-xs font-black px-4 italic text-slate-400 uppercase tracking-widest">Page {currentPage} of {totalPages}</span>
           <button 
             disabled={currentPage === totalPages} 
             onClick={() => setCurrentPage(p => p + 1)} 
             className="p-3 bg-slate-900 rounded-2xl disabled:opacity-20 text-blue-500 hover:bg-slate-700 transition-all"
           >
             <ChevronRight size={20}/>
           </button>
        </div>
      </div>
    </div>
  );
};

export default ProductList;