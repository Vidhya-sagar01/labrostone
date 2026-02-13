import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, RefreshCw, UploadCloud, Tag } from 'lucide-react';

const isLocal = window.location.hostname === "localhost";
const API_BASE = isLocal 
    ? "http://localhost:5000" 
    : "https://lebrostonebackend.lifeinfotechinstitute.com";

const AnantamBanner = () => {
    const [allProducts, setAllProducts] = useState([]); // ✅ Original Data
    const [filteredProducts, setFilteredProducts] = useState([]); // ✅ Filtered Data
    const [loading, setLoading] = useState(false);
    const [bannerUrl, setBannerUrl] = useState(localStorage.getItem('admin_cached_banner') || "");
    
    const [filters, setFilters] = useState({
        productTag: '', 
        startDate: '',
        endDate: '',
        is_combo: false
    });

    const getAuthHeader = () => {
        const token = localStorage.getItem('adminToken');
        return { headers: { Authorization: `Bearer ${token}` } };
    };

    const processImageUrl = (imagePath) => {
        if (!imagePath) return "https://via.placeholder.com/150?text=No+Image";
        if (typeof imagePath === 'string' && (imagePath.startsWith('http') || imagePath.startsWith('blob'))) return imagePath;
        return `${API_BASE}/${String(imagePath).replace(/^\//, '')}`;
    };

    // ✅ Initial Data Fetch
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                setLoading(true);
                // 1. Fetch Banner
                const bannerRes = await axios.get(`${API_BASE}/api/products/banner`);
                if (bannerRes.data.success) {
                    const freshBanner = processImageUrl(bannerRes.data.url);
                    setBannerUrl(`${freshBanner}?t=${Date.now()}`);
                }

                // 2. Fetch All Products for filtering
                const res = await axios.get(`${API_BASE}/api/products`, getAuthHeader());
                const data = res.data.data || [];
                setAllProducts(data);
                setFilteredProducts(data); // Default view
            } catch (err) {
                console.error("Fetch Error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchInitialData();
    }, []);

    // ✅ FIXED: Frontend Filter Logic
    const handleApplyFilters = () => {
        setLoading(true);
        setTimeout(() => {
            let results = [...allProducts];

            // 1. Filter by Tag
            if (filters.productTag) {
                results = results.filter(p => p.productTag === filters.productTag);
            }

            // 2. Filter by Combo status
            if (filters.is_combo) {
                results = results.filter(p => p.is_combo === true || p.isCombo === true);
            }

            // 3. Filter by Date Range
            if (filters.startDate) {
                const start = new Date(filters.startDate).getTime();
                results = results.filter(p => new Date(p.createdAt).getTime() >= start);
            }
            if (filters.endDate) {
                const end = new Date(filters.endDate).getTime();
                results = results.filter(p => new Date(p.createdAt).getTime() <= end);
            }

            setFilteredProducts(results);
            setLoading(false);
        }, 300); // Halka sa delay smooth UX ke liye
    };

    const handleToggleAnantam = async (productId, currentStatus) => {
        try {
            const res = await axios.put(`${API_BASE}/api/products/anantam/${productId}`, 
                { is_anantam: !currentStatus }, getAuthHeader());
            if (res.data.success) {
                // Update both lists
                const updateList = (list) => list.map(p => p._id === productId ? { ...p, is_anantam: !currentStatus } : p);
                setAllProducts(prev => updateList(prev));
                setFilteredProducts(prev => updateList(prev));
            }
        } catch (err) { alert("Status update failed."); }
    };

    const handleBannerUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const formData = new FormData();
        formData.append('banner', file);
        try {
            const res = await axios.post(`${API_BASE}/api/products/banner-upload`, formData, {
                headers: { ...getAuthHeader().headers, 'Content-Type': 'multipart/form-data' }
            });
            if (res.data.success) {
                setBannerUrl(`${processImageUrl(res.data.url)}?t=${Date.now()}`);
                alert("Banner Updated! ✅");
            }
        } catch (err) { alert("Upload failed."); }
    };

    return (
        <div className="min-h-screen bg-slate-50 p-6 md:p-10 font-sans text-slate-900">
            <div className="max-w-7xl mx-auto space-y-8">
                <h1 className="text-4xl font-black uppercase  tracking-tighter text-slate-900">
                    Anantam <span className="text-blue-600">Manager</span>
                </h1>

                {/* Banner Section (As it was) */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 bg-slate-200 rounded-[2.5rem] shadow-sm h-[250px] overflow-hidden border border-slate-100">
                        <img src={bannerUrl} alt="Banner" className="w-full h-full object-cover" />
                    </div>
                    <div className="bg-white rounded-[2.5rem] p-8 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center space-y-4">
                        <label className="cursor-pointer flex flex-col items-center space-y-2 group">
                            <UploadCloud size={32} className="text-orange-500 group-hover:scale-110 transition-transform" />
                            <span className="text-xs font-black uppercase">Change Banner</span>
                            <input type="file" className="hidden" onChange={handleBannerUpload} />
                        </label>
                    </div>
                </div>

                {/* Filter Bar (Changed onClick to handleApplyFilters) */}
                <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-slate-100 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 items-end">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-400">Product Tag</label>
                        <select 
                            value={filters.productTag} 
                            onChange={(e) => setFilters({...filters, productTag: e.target.value})} 
                            className="w-full bg-slate-50 rounded-2xl p-4 text-sm font-bold outline-none ring-1 ring-slate-100"
                        >
                            <option value="">All Products</option>
                            <option value="Best Seller">Best Seller</option>
                            <option value="New Arrival">New Arrival</option>
                            <option value="Simple">Simple</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-400">From Date</label>
                        <input type="date" value={filters.startDate} onChange={(e) => setFilters({...filters, startDate: e.target.value})} className="w-full bg-slate-50 rounded-2xl p-4 text-sm font-bold outline-none ring-1 ring-slate-100" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-400">To Date</label>
                        <input type="date" value={filters.endDate} onChange={(e) => setFilters({...filters, endDate: e.target.value})} className="w-full bg-slate-50 rounded-2xl p-4 text-sm font-bold outline-none ring-1 ring-slate-100" />
                    </div>
                    <button 
                        onClick={handleApplyFilters} // ✅ Ab ye frontend results ko filter karega
                        className="w-full bg-slate-900 text-white h-[56px] rounded-2xl font-black text-xs flex items-center justify-center gap-3 hover:bg-orange-600 transition-all shadow-lg"
                    >
                        {loading ? <RefreshCw className="animate-spin" size={18} /> : <Search size={18} />} Apply Filter
                    </button>
                </div>

                {/* Table (Showing filteredProducts) */}
                <div className="bg-white rounded-[3rem] overflow-hidden shadow-sm border border-slate-100">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50/50 text-[10px] font-black uppercase text-slate-400 border-b">
                            <tr>
                                <th className="p-8">Product Details</th>
                                <th className="p-8 text-center">Badge</th>
                                <th className="p-8">Price</th>
                                <th className="p-8 text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredProducts.map((p) => (
                                <tr key={p._id} className="hover:bg-slate-50/30 transition-all">
                                    <td className="p-8">
                                        <div className="flex items-center gap-4">
                                            <img src={p.thumbnail ? processImageUrl(p.thumbnail) : "https://via.placeholder.com/50"} className="w-14 h-14 rounded-2xl object-cover" alt="" />
                                            <div className="text-sm font-black text-slate-800 uppercase">{p.name}</div>
                                        </div>
                                    </td>
                                    <td className="p-8 text-center">
                                        <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase bg-slate-100 text-slate-500">
                                            {p.productTag || 'Simple'}
                                        </span>
                                    </td>
                                    <td className="p-8 font-black text-slate-700">₹{p.unitPrice || 0}</td>
                                    <td className="p-8 text-center">
                                        <button 
                                            onClick={() => handleToggleAnantam(p._id, p.is_anantam)} 
                                            className={`px-6 py-3 rounded-full text-[10px] font-black uppercase transition-all ${
                                                p.is_anantam ? 'bg-emerald-500 text-white shadow-lg' : 'bg-white border-2 border-slate-100 text-slate-400'
                                            }`}
                                        >
                                            {p.is_anantam ? '✓ Added' : '+ Add Anantam'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredProducts.length === 0 && (
                        <div className="p-20 text-center text-slate-400 font-bold uppercase tracking-widest">No Products Found</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AnantamBanner;