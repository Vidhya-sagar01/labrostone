import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Save, Package, Plus, RefreshCw } from 'lucide-react';

const Season = () => {
  // 1. States Define Karein
  const [categories, setCategories] = useState([]);
  const [products1, setProducts1] = useState([]);
  const [products2, setProducts2] = useState([]);
  
  const [selectedCat1, setSelectedCat1] = useState('');
  const [selectedCat2, setSelectedCat2] = useState('');
  const [selectedProd1, setSelectedProd1] = useState(null);
  const [selectedProd2, setSelectedProd2] = useState(null);
  
  const [comboName, setComboName] = useState('');
  const [sellingPrice, setSellingPrice] = useState(0);
  const [loading, setLoading] = useState(false);

  const API_BASE = "http://localhost:5000";

  // 2. Categories Fetch Karein (Step-by-Step Fix)
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/categories`);
        // Backend response handle karein
        const catData = res.data.categories || res.data.data || res.data;
        setCategories(Array.isArray(catData) ? catData : []);
      } catch (err) {
        console.error("Category load error:", err);
      }
    };
    fetchCategories();
  }, []);

  // 3. Products Fetch Function
  const fetchProds = async (catId, section) => {
    if (!catId) return;
    try {
      const res = await axios.get(`${API_BASE}/api/products/by-category/${catId}`);
      if (section === 1) setProducts1(res.data.data || []);
      else setProducts2(res.data.data || []);
    } catch (err) {
      console.error("Product load error:", err);
    }
  };

  // 4. Automatic MRP Calculation
  const totalMRP = (selectedProd1?.variants[0]?.mrp || 0) + (selectedProd2?.variants[0]?.mrp || 0);

  // 5. Save Combo to Backend
  const saveCombo = async () => {
    if (!selectedProd1 || !selectedProd2 || !comboName || !sellingPrice) {
      alert("Please fill all details!");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const data = {
        name: comboName,
        includedProducts: [selectedProd1._id, selectedProd2._id],
        mrp: totalMRP,
        selling_price: Number(sellingPrice),
        category_id: selectedProd1.category_id // Default category assignment
      };

      await axios.post(`${API_BASE}/api/products/create-combo`, data, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      alert("Combo Saved Successfully! 🎁");
      window.location.reload(); // Refresh to clear states
    } catch (err) {
      alert("Error: " + err.response?.data?.message || "Failed to save");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-10 bg-slate-900 min-h-screen text-white font-sans">
      
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
        <div>
          <h1 className="text-3xl font-black uppercase italic text-orange-500 tracking-tighter">Combo Architect</h1>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em]">Build product bundles with automatic pricing</p>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <input 
            placeholder="Combo Name..." 
            className="bg-slate-800 p-4 rounded-2xl border border-slate-700 outline-none focus:border-orange-500 font-bold flex-1"
            value={comboName} 
            onChange={e => setComboName(e.target.value)} 
          />
          <button 
            onClick={saveCombo} 
            disabled={loading}
            className="bg-orange-500 hover:bg-orange-600 px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg shadow-orange-500/20 disabled:opacity-50 transition-all"
          >
            {loading ? <RefreshCw className="animate-spin" /> : <Save size={20}/>}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* SECTION 1: Left Side Selection */}
        <div className="bg-slate-800 p-8 rounded-[2.5rem] border border-slate-700">
          <label className="text-[10px] font-black uppercase text-orange-500 mb-4 block">Select Product One</label>
          <select 
            className="w-full bg-slate-900 p-4 rounded-2xl mb-6 border border-slate-700 outline-none focus:border-orange-500 font-bold" 
            value={selectedCat1} 
            onChange={e => { setSelectedCat1(e.target.value); fetchProds(e.target.value, 1); }}
          >
            <option value="">Choose Category</option>
            {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>
          
          <div className="space-y-2 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
            {products1.map(p => (
              <div 
                key={p._id} 
                onClick={() => setSelectedProd1(p)} 
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex justify-between items-center ${selectedProd1?._id === p._id ? 'border-orange-500 bg-orange-500/10' : 'border-slate-700 hover:bg-slate-700'}`}
              >
                <span className="font-bold text-sm uppercase">{p.name}</span>
                <span className="text-xs font-black text-slate-500 italic">₹{p.variants[0]?.mrp}</span>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 2: Right Side Selection */}
        <div className="bg-slate-800 p-8 rounded-[2.5rem] border border-slate-700">
          <label className="text-[10px] font-black uppercase text-blue-500 mb-4 block">Select Product Two</label>
          <select 
            className="w-full bg-slate-900 p-4 rounded-2xl mb-6 border border-slate-700 outline-none focus:border-blue-500 font-bold" 
            value={selectedCat2} 
            onChange={e => { setSelectedCat2(e.target.value); fetchProds(e.target.value, 2); }}
          >
            <option value="">Choose Category</option>
            {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>
          
          <div className="space-y-2 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
            {products2.map(p => (
              <div 
                key={p._id} 
                onClick={() => setSelectedProd2(p)} 
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex justify-between items-center ${selectedProd2?._id === p._id ? 'border-blue-500 bg-blue-500/10' : 'border-slate-700 hover:bg-slate-700'}`}
              >
                <span className="font-bold text-sm uppercase">{p.name}</span>
                <span className="text-xs font-black text-slate-500 italic">₹{p.variants[0]?.mrp}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* PRICE SUMMARY BAR */}
      <div className="mt-10 bg-white text-slate-900 p-10 rounded-[3.5rem] shadow-2xl flex flex-col md:flex-row justify-between items-center gap-8">
        <div>
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Original MRP</div>
          <div className="text-4xl font-black italic tracking-tighter">₹{totalMRP}</div>
        </div>
        
        <div className="flex items-center gap-6 bg-slate-50 p-6 rounded-3xl border border-slate-100">
          <div>
            <label className="text-[10px] font-black uppercase text-emerald-600 block mb-1">Set Combo Price</label>
            <input 
              type="number" 
              className="bg-transparent text-3xl font-black outline-none w-32 text-slate-800" 
              placeholder="0"
              value={sellingPrice} 
              onChange={e => setSellingPrice(e.target.value)} 
            />
          </div>
          <div className="text-right">
            <div className="text-[10px] font-bold text-orange-500 uppercase">You Save</div>
            <div className="text-xl font-black text-orange-500 italic">₹{totalMRP - sellingPrice}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Season;