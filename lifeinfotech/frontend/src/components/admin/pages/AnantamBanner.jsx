import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Search, RefreshCw, UploadCloud, CheckCircle2, Package 
} from 'lucide-react';

const AnantamBanner = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // 1. Anti-Blink: LocalStorage se purana path uthao agar server down ho
  const [bannerUrl, setBannerUrl] = useState(localStorage.getItem('admin_cached_banner') || "");
  
  const [filters, setFilters] = useState({
    category: '',
    startDate: '',
    endDate: '',
    is_combo: false
  });

  const API_BASE = "http://localhost:5000";

  const getAuthHeader = () => {
    const token = localStorage.getItem('adminToken');
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  // 2. Initial Data Load
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [catRes, bannerRes] = await Promise.all([
          axios.get(`${API_BASE}/api/categories`),
          axios.get(`${API_BASE}/api/products/banner`)
        ]);
        
        const catData = catRes.data.data || catRes.data;
        if (Array.isArray(catData)) setCategories(catData);
        
        if (bannerRes.data.success) {
          const freshBanner = `${bannerRes.data.url}?t=${Date.now()}`;
          setBannerUrl(freshBanner);
          // Browser ki memory mein save kar lo (Blinking rokne ke liye)
          localStorage.setItem('admin_cached_banner', freshBanner);
        }
      } catch (err) {
        console.error("Initial Load Error:", err);
      }
    };
    fetchInitialData();
    applyFilters(); 
  }, []);

  // 3. Optimized Apply Filters
  const applyFilters = async () => {
    setLoading(true);
    try {
      const params = {
        ...(filters.category && { category: filters.category }),
        ...(filters.startDate && { startDate: filters.startDate }),
        ...(filters.endDate && { endDate: filters.endDate }),
        is_combo: String(filters.is_combo),
        _t: Date.now()
      };

      const res = await axios.get(`${API_BASE}/api/products/search`, { 
        params, 
        ...getAuthHeader() 
      });

      if (res.data.success) {
        setProducts(res.data.data || []);
      }
    } catch (err) {
      console.error("Filter Error:", err);
    }
    setLoading(false);
  };

  // 4. Banner Upload (Updates Memory Instantly)
  const handleBannerUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('banner', file);

    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/api/products/banner-upload`, formData, {
        headers: { 
          ...getAuthHeader().headers,
          'Content-Type': 'multipart/form-data' 
        }
      });
      if (res.data.success) {
        const uploadedUrl = res.data.url;
        setBannerUrl(uploadedUrl);
        localStorage.setItem('admin_cached_banner', uploadedUrl);
        alert("Banner Updated! ✅");
      }
    } catch (err) {
      alert("Upload failed.");
    }
    setLoading(false);
  };

  // 5. Toggle Anantam
  const handleToggleAnantam = async (productId, currentStatus) => {
    try {
      const res = await axios.put(
        `${API_BASE}/api/products/anantam/${productId}`, 
        { is_anantam: !currentStatus },
        getAuthHeader()
      );
      if (res.data.success) {
        setProducts(prev => prev.map(p => 
          p._id === productId ? { ...p, is_anantam: !currentStatus } : p
        ));
      }
    } catch (err) {
      console.error("Toggle Error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10 font-sans text-slate-900">
      <div className="max-w-7xl mx-auto space-y-8">
        
        <h1 className="text-4xl font-black uppercase italic tracking-tighter">
          Anantam <span className="text-orange-600">Manager</span>
        </h1>

        {/* --- DYNAMIC BANNER SECTION --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-slate-200 rounded-[2.5rem] shadow-sm h-[250px] overflow-hidden border border-slate-100 relative">
            {/* Jab tak URL na ho, loader dikhega */}
            {!bannerUrl && <div className="absolute inset-0 animate-pulse bg-slate-300" />}
            
            <img 
              key={bannerUrl} 
              src={bannerUrl || "/banar/banner1.jpg"} 
              alt="Anantam Banner" 
              className="w-full h-full object-cover rounded-[2rem] transition-opacity duration-500" 
              style={{ opacity: bannerUrl ? 1 : 0 }}
              onError={(e) => { e.target.src = "/banar/banner1.jpg"; }}
            />
          </div>

          <div className="bg-white rounded-[2.5rem] p-8 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center space-y-4 hover:border-orange-300 transition-colors">
            <label className="cursor-pointer flex flex-col items-center space-y-2 group">
              <div className="w-16 h-16 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <UploadCloud size={32} />
              </div>
              <span className="text-xs font-black uppercase text-slate-700">Change Banner</span>
              <input type="file" className="hidden" onChange={handleBannerUpload} disabled={loading} />
            </label>
            {loading && <RefreshCw className="animate-spin text-orange-600" size={20} />}
          </div>
        </div>

        {/* --- FILTER BAR --- */}
        <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-slate-100 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 items-end">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 text-center">Category</label>
            <select 
              value={filters.category} 
              onChange={(e) => setFilters({...filters, category: e.target.value})} 
              className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold outline-none ring-1 ring-slate-100 focus:ring-orange-200"
            >
              <option value="">All Categories</option>
              {categories.map(cat => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400">From Date</label>
            <input type="date" value={filters.startDate} onChange={(e) => setFilters({...filters, startDate: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold outline-none ring-1 ring-slate-100" />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400">To Date</label>
            <input type="date" value={filters.endDate} onChange={(e) => setFilters({...filters, endDate: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold outline-none ring-1 ring-slate-100" />
          </div>

          <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-2xl h-[56px] cursor-pointer ring-1 ring-slate-100 hover:bg-slate-100">
            <input 
              type="checkbox" 
              id="combo"
              checked={filters.is_combo} 
              onChange={(e) => setFilters({...filters, is_combo: e.target.checked})} 
              className="w-5 h-5 accent-orange-500" 
            />
            <label htmlFor="combo" className="text-[10px] font-black uppercase text-slate-600 cursor-pointer">Combo Only</label>
          </div>

          <button 
            onClick={applyFilters} 
            className="w-full bg-slate-900 text-white h-[56px] rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-orange-600 transition-all shadow-lg"
          >
            {loading ? <RefreshCw className="animate-spin" size={18} /> : <Search size={18} />} Apply Filters
          </button>
        </div>

        {/* --- DYNAMIC PRODUCT TABLE --- */}
        <div className="bg-white rounded-[3rem] overflow-hidden shadow-sm border border-slate-100">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 text-[10px] font-black uppercase text-slate-400 tracking-widest">
              <tr>
                <th className="p-8">Product Details</th>
                <th className="p-8">Type</th>
                <th className="p-8">Price</th>
                <th className="p-8 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan="4" className="p-20 text-center">
                    <RefreshCw className="animate-spin mx-auto text-orange-500" size={32} />
                  </td>
                </tr>
              ) : products.length > 0 ? (
                products.map((p) => (
                  <tr key={p._id} className="hover:bg-slate-50/30 transition-all group">
                    <td className="p-8">
                      <div className="flex items-center gap-4">
                        <img 
                          src={p.images?.[0] || "https://via.placeholder.com/150"} 
                          className="w-14 h-14 rounded-2xl object-cover shadow-sm bg-slate-100" 
                          alt={p.name} 
                        />
                        <div>
                          <div className="text-sm font-black text-slate-800 uppercase tracking-tighter">
                            {p.name || "Untitled Product"}
                          </div>
                          <div className="text-[10px] text-slate-400 font-bold uppercase">
                            {p.category_id?.name || "No Category"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-8">
                      <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${p.is_combo ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}>
                        {p.is_combo ? 'Combo' : 'Single'}
                      </span>
                    </td>
                    <td className="p-8 font-black text-slate-700 italic text-sm">
                      ₹{p.variants?.[0]?.selling_price || p.price || 0}
                    </td>
                    <td className="p-8 text-center">
                      <button 
                        onClick={() => handleToggleAnantam(p._id, p.is_anantam)} 
                        className={`px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                          p.is_anantam 
                            ? 'bg-emerald-500 text-white shadow-lg' 
                            : 'bg-white border-2 border-slate-100 text-slate-400 hover:border-slate-900 hover:text-slate-900'
                        }`}
                      >
                        {p.is_anantam ? 'Added' : 'Add Anantam'}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="p-24 text-center">
                    <p className="text-slate-300 font-black italic tracking-widest uppercase text-sm">No Products Found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AnantamBanner;