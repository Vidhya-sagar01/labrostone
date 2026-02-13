import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { Save, ArrowLeft, Image as ImageIcon, Info, Cpu, Plus, Trash } from 'lucide-react';

const API_BASE = window.location.hostname === 'localhost' 
  ? 'http://localhost:5000' 
  : 'https://lebrostonebackend.lifeinfotechinstitute.com';

const Editprodoct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  // Dependency states
  const [additionalImages, setAdditionalImages] = useState([]); // For New Files
  const [existingImages, setExistingImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [subSubCategories, setSubSubCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  
  

  // Full FormData State (Matching AddProduct)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    subCategory: '',
    subSubCategory: '',
    brand: '',
    productType: 'Physical',
    sku: '',
    unit: 'kg',
    unitPrice: 0,
    minOrderQty: 1,
    currentStockQty: 0, 
    discountType: 'Flat', 
    discountAmount: 0,
    taxAmount: 0,
    taxCalculation: 'Include with product',
    shippingCost: 0,
    multiplyQty: false,
    status: true
  });

  const [thumbnail, setThumbnail] = useState(null);
  const [thumbPreview, setThumbPreview] = useState(null);
  


  useEffect(() => {
    fetchDependencies();
    fetchProductDetails();
  }, [id]);

  const fetchDependencies = async () => {
    try {
      const getHeader = { headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` } };
      const [cat, sub, subSub, br] = await Promise.all([
        axios.get(`${API_BASE}/api/categories`, getHeader),
        axios.get(`${API_BASE}/api/subcategories`, getHeader),
        axios.get(`${API_BASE}/api/subsubcategories`, getHeader),
        axios.get(`${API_BASE}/api/brands`, getHeader)
      ]);
      setCategories(cat.data.data || []);
      setSubCategories(sub.data.data || []);
      setSubSubCategories(subSub.data.data || []);
      setBrands(br.data.data || []);
    } catch (err) { console.error("Fetch dependencies error", err); }
  };

  const fetchProductDetails = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/products/${id}`);
      const p = res.data.data;
      
      setFormData({
        name: p.name || '',
        description: p.description || '',
        category: p.category?._id || p.category || '',
        subCategory: p.subCategory?._id || p.subCategory || '',
        subSubCategory: p.subSubCategory?._id || p.subSubCategory || '',
        brand: p.brand?._id || p.brand || '',
        productType: p.productType || 'Physical',
        sku: p.sku || '',
        unit: p.unit || 'kg',
        unitPrice: p.unitPrice || 0,
        minOrderQty: p.minOrderQty || 1,
        currentStockQty: p.currentStockQty || 0,
        discountType: p.discountType || 'Flat',
        discountAmount: p.discountAmount || 0,
        taxAmount: p.taxAmount || 0,
        taxCalculation: p.taxCalculation || 'Include with product',
        shippingCost: p.shippingCost || 0,
        multiplyQty: p.multiplyQty || false,
        status: p.status ?? true
      });

      setThumbPreview(p.thumbnail);
      setExistingImages(p.images || []);
      setLoading(false);
    } catch (err) {
      alert("Product details fetch error!");
      navigate('/admin/productadminlist');
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

 const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    
    if (thumbnail) data.append('thumbnail', thumbnail);
    
    // Nayi gallery images add karne ke liye
    if (additionalImages.length > 0) {
      additionalImages.forEach(file => data.append('images', file));
    }

    try {
      await axios.put(`${API_BASE}/api/products/${id}`, data, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem("adminToken")}` 
        }
      });
      alert("Product Updated ✅");
      navigate('/admin/productadminlist');
    } catch (err) {
      alert("Update failed: " + err.message);
    }
  };

  if (loading) return <div className="p-10 text-center font-bold">Loading Data...</div>;

  return (
    <div className="p-6 bg-[#f3f4f7] min-h-screen font-sans text-[#334257]">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate(-1)} className="p-2 bg-white rounded shadow-sm hover:bg-gray-50"><ArrowLeft size={20} /></button>
        <h1 className="text-2xl font-bold italic underline uppercase text-blue-900">Edit Product</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-[1400px] mx-auto">
        
        {/* BASIC INFO */}
        <div className="bg-white rounded shadow-sm border p-6">
          <label className="block text-xs font-bold mb-2 uppercase text-slate-500 italic">Product Name</label>
          <input type="text" name="name" className="w-full border rounded p-2.5 mb-4 font-semibold text-lg" value={formData.name} onChange={handleInputChange} required />
          <label className="block text-xs font-bold mb-2 uppercase text-slate-500 italic">Description</label>
          <div className="h-64 mb-12">
            <ReactQuill theme="snow" className="h-48 bg-white" value={formData.description} onChange={val => setFormData({...formData, description: val})} />
          </div>
        </div>

        {/* GENERAL SETUP */}
        <div className="bg-white rounded shadow-sm border">
          <div className="px-6 py-4 border-b bg-slate-50 flex items-center gap-2 font-bold uppercase text-xs"><Cpu size={18} className="text-blue-500" /> General Setup</div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <label className="block text-xs font-bold mb-2 uppercase italic text-slate-400">Category</label>
              <select name="category" className="w-full border rounded p-2.5 font-bold" value={formData.category} onChange={handleInputChange} required>
                <option value="">Select Category</option>
                {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold mb-2 uppercase italic text-slate-400">Sub Category</label>
              <select name="subCategory" className="w-full border rounded p-2.5 font-bold" value={formData.subCategory} onChange={handleInputChange}>
                <option value="">Select Sub Category</option>
                {subCategories.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold mb-2 uppercase italic text-slate-400">Brand</label>
              <select name="brand" className="w-full border rounded p-2.5 font-bold" value={formData.brand} onChange={handleInputChange}>
                <option value="">Select Brand</option>
                {brands.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
              </select>
            </div>
            <div>
                <label className="block text-xs font-bold mb-2 uppercase italic text-slate-400">SKU</label>
                <input type="text" name="sku" className="w-full border rounded p-2.5 font-bold" value={formData.sku} onChange={handleInputChange} />
            </div>
          </div>
        </div>

        {/* PRICING & STOCK (All AddProduct fields added) */}
        <div className="bg-white rounded shadow-sm border">
          <div className="px-6 py-4 border-b bg-slate-50 flex items-center gap-2 font-bold uppercase text-xs text-blue-900"><Info size={18} className="text-blue-500" /> Pricing & others</div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-6">
            <div><label className="text-xs font-bold text-slate-500 uppercase italic">Unit Price (₹)</label><input type="number" name="unitPrice" className="w-full border rounded-lg p-2.5" value={formData.unitPrice} onChange={handleInputChange} required /></div>
            <div><label className="text-xs font-bold text-slate-500 uppercase italic">Stock Qty</label><input type="number" name="currentStockQty" className="w-full border rounded-lg p-2.5" value={formData.currentStockQty} onChange={handleInputChange} /></div>
            <div><label className="text-xs font-bold text-slate-500 uppercase italic">Discount Amount</label><input type="number" name="discountAmount" className="w-full border rounded-lg p-2.5" value={formData.discountAmount} onChange={handleInputChange} /></div>
            <div><label className="text-xs font-bold text-slate-500 uppercase italic">Tax Amount (%)</label><input type="number" name="taxAmount" className="w-full border rounded-lg p-2.5" value={formData.taxAmount} onChange={handleInputChange} /></div>
            <div><label className="text-xs font-bold text-slate-500 uppercase italic">Shipping Cost (₹)</label><input type="number" name="shippingCost" className="w-full border rounded-lg p-2.5" value={formData.shippingCost} onChange={handleInputChange} /></div>
            <div className="flex items-center gap-4 mt-6">
                <label className="text-xs font-bold text-slate-500 uppercase italic">Multiply Shipping</label>
                <input type="checkbox" name="multiplyQty" checked={formData.multiplyQty} onChange={handleInputChange} className="w-5 h-5 cursor-pointer" />
            </div>
          </div>
        </div>

        {/* IMAGES */}
       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Main Thumbnail */}
          <div className="bg-white p-6 rounded border shadow-sm">
            <label className="block font-bold mb-4 uppercase text-xs italic text-blue-600">Main Thumbnail</label>
            <div className="border-2 border-dashed rounded p-4 text-center relative bg-slate-50 flex flex-col items-center justify-center min-h-[150px]">
              <img 
                src={thumbnail ? URL.createObjectURL(thumbnail) : (thumbPreview?.startsWith('http') ? thumbPreview : `${API_BASE}${thumbPreview}`)} 
                className="h-32 object-contain" 
                onError={(e) => e.target.src="https://via.placeholder.com/150"} 
                alt="thumbnail"
              />
              <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => {setThumbnail(e.target.files[0]); setThumbPreview(URL.createObjectURL(e.target.files[0]))}} />
              <p className="text-[10px] mt-2 text-gray-400 font-bold">Click to Change</p>
            </div>
          </div>

          {/* Gallery Images (The Fix) */}
          <div className="bg-white p-6 rounded border shadow-sm">
            <label className="block font-bold mb-4 uppercase text-xs italic text-blue-600">Gallery Images (Old & New)</label>
            <div className="flex flex-wrap gap-2">
              
              {/* 1. Purani Images jo DB mein hain */}
              {existingImages.map((img, i) => (
                <div key={`old-${i}`} className="w-20 h-20 border rounded p-1 bg-blue-50 relative group">
                  <img src={img.startsWith('http') ? img : `${API_BASE}${img}`} className="w-full h-full object-cover rounded" alt="old" />
                  <div className="absolute top-0 left-0 bg-blue-600 text-white text-[7px] px-1 font-bold">EXISTING</div>
                </div>
              ))}

              {/* 2. Nayi Images jo abhi select ki hain */}
              {additionalImages.map((img, i) => (
                <div key={`new-${i}`} className="w-20 h-20 border rounded relative group bg-white p-1 shadow-md">
                  <img src={URL.createObjectURL(img)} className="w-full h-full object-cover rounded" alt="new" />
                  <button type="button" onClick={() => setAdditionalImages(additionalImages.filter((_, idx) => idx !== i))} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:scale-110 transition-transform">
                    <Trash size={10} />
                  </button>
                </div>
              ))}

              {/* Add Button */}
              <div className="w-20 h-20 border-2 border-dashed rounded flex flex-col items-center justify-center relative cursor-pointer bg-slate-50 hover:bg-blue-50 transition-all">
                <Plus size={16} />
                <span className="text-[8px] font-bold">ADD MORE</span>
                <input type="file" multiple className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => setAdditionalImages([...additionalImages, ...Array.from(e.target.files)])} />
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-4 pb-10">
          <button type="submit" className="px-10 py-3 bg-blue-600 text-white rounded font-bold shadow-xl flex items-center gap-2 hover:bg-blue-700 uppercase text-sm">
            <Save size={18} /> Update Product
          </button>
        </div>
      </form>
    </div>
  );
};

export default Editprodoct;