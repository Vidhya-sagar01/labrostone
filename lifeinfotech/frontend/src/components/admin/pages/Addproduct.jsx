import React, { useState, useEffect } from 'react';
import instance from '../../web/api/AxiosConfig';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { Save, Image as ImageIcon, Info, Cpu, Plus, Trash ,Layers} from 'lucide-react';

const AddProduct = () => {
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [subSubCategories, setSubSubCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  // ✅ Schema ke exact keys ke saath state
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
    taxAmount: 0,                // Added
    taxCalculation: 'Include with product', // Added
    shippingCost: 0,
    multiplyQty: false,          // Added
    status: true,
    is_new_arrival: false,
    is_bestseller: false
  });

  const [thumbnail, setThumbnail] = useState(null); 
  const [additionalImages, setAdditionalImages] = useState([]); 

  useEffect(() => { fetchDependencies(); }, []);

  const fetchDependencies = async () => {
    try {
      const getHeader = { headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` } };
      const [cat, sub, subSub, br] = await Promise.all([
        instance.get("/api/categories", getHeader),
        instance.get("/api/subcategories", getHeader),
        instance.get("/api/subsubcategories", getHeader),
        instance.get("/api/brands", getHeader)
      ]);
      setCategories(cat.data.data || []);
      setSubCategories(sub.data.data || []);
      setSubSubCategories(subSub.data.data || []);
      setBrands(br.data.data || []);
    } catch (err) { console.error("Fetch error", err); }
  };

  const handleCategoryChange = (id) => {
    setFormData({...formData, category: id, subCategory: '', subSubCategory: ''});
    setFilteredSubs(subCategories.filter(s => (s.mainCategory?._id || s.mainCategory) === id));
  };

  const handleSubCategoryChange = (id) => {
    setFormData({...formData, subCategory: id, subSubCategory: ''});
    setFilteredSubSubs(subSubCategories.filter(s => (s.subCategory?._id || s.subCategory) === id));
  };

  const handleAdditionalImages = (e) => {
    const files = Array.from(e.target.files);
    setAdditionalImages((prev) => [...prev, ...files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    if (thumbnail) data.append('thumbnail', thumbnail); 
    additionalImages.forEach((file) => {
        data.append('images', file); 
    });

    try {
      await instance.post("/api/products", data, {
        headers: { 
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      alert("Product Added Successfully! ✅");
    } catch (err) { 
        console.error(err);
        alert("Error! ❌"); 
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
 <div className="p-4 md:p-6 bg-[#f8fafc] min-h-screen text-slate-700 font-sans">
  
  {/* --- Identical Heading Style --- */}
  <h1 className="text-xl font-bold mb-6 flex items-center gap-2">
    <Layers size={20} className="text-blue-600" /> Add New Product
  </h1>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-[1400px] mx-auto">
        
        {/* BASIC INFO */}
        <div className="bg-white rounded shadow-sm border p-6">
          <label className="block text-xs font-bold mb-2 uppercase text-slate-500 italic">Product Name (EN)</label>
          <input type="text" className="w-full border rounded p-2.5 mb-4 font-semibold text-lg" value={formData.name} onChange={e=>setFormData({...formData, name:e.target.value})} required />
          
          <label className="block text-xs font-bold mb-2 uppercase text-slate-500 italic">Description (EN)</label>
          <div className="h-64 mb-12">
            <ReactQuill theme="snow" className="h-48 bg-white" value={formData.description} onChange={val => setFormData({...formData, description: val})} />
          </div>
        </div>

        {/* GENERAL SETUP (Dropdwons) */}
        <div className="bg-white rounded shadow-sm border">
          <div className="px-6 py-4 border-b bg-slate-50 flex items-center gap-2 font-bold uppercase text-xs">
            <Cpu size={18} className="text-blue-500" /> General Setup
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-6">
           <div>
          <label className="block text-xs font-bold mb-2 uppercase italic text-slate-400">Category</label>
          <select 
            className="w-full border rounded p-2.5 font-bold" 
            name="category"
            value={formData.category} 
            onChange={handleInputChange} 
            required
          >
            <option value="">Select Category</option>
            {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>
        </div>
           <div>
          <label className="block text-xs font-bold mb-2 uppercase italic text-slate-400">Sub Category</label>
          <select 
            className="w-full border rounded p-2.5 font-bold" 
            name="subCategory"
            value={formData.subCategory} 
            onChange={handleInputChange}
          >
            <option value="">Select Sub Category</option>
            {subCategories.map(s => (
              <option key={s._id} value={s._id}>
                {s.name} {s.mainCategory?.name ? `(${s.mainCategory.name})` : ''}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold mb-2 uppercase italic text-slate-400">Sub Sub Category</label>
          <select 
            className="w-full border rounded p-2.5 font-bold" 
            name="subSubCategory"
            value={formData.subSubCategory} 
            onChange={handleInputChange}
          >
            <option value="">Select Sub Sub Category</option>
            {subSubCategories.map(s => (
              <option key={s._id} value={s._id}>
                {s.name} {s.subCategory?.name ? `(${s.subCategory.name})` : ''}
              </option>
            ))}
          </select>
        </div>
            <div>
                <label className="block text-xs font-bold mb-2 uppercase italic text-slate-400">Brand</label>
                <select className="w-full border rounded p-2.5 font-bold" value={formData.brand} onChange={e=>setFormData({...formData, brand: e.target.value})}>
                <option value="">Select Brand</option>
                {brands.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
                </select>
            </div>
          </div>

          <div className="px-6 pb-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
                <label className="block text-xs font-bold mb-2 uppercase italic text-slate-400">Product SKU</label>
                <input type="text" placeholder="Ex: 161183" className="w-full border rounded p-2.5 font-bold" value={formData.sku} onChange={e=>setFormData({...formData, sku:e.target.value})} required />
            </div>
            <div className="flex flex-col gap-1.5">
  {/* Theme ke mutabiq Label styling */}
  <label className="block text-xs font-black mb-2 uppercase italic text-slate-500">
    Unit Selection *
  </label>
  
  <select 
    className="w-full border rounded-lg p-2.5 font-bold bg-white outline-none focus:border-blue-400 text-sm shadow-sm transition-all" 
    value={formData.unit} 
    onChange={e => setFormData({...formData, unit: e.target.value})}
    required
  >
    <option value="" disabled>-- Choose Unit --</option>
    
    {/* Weight Units (Vajan) */}
    <optgroup label="Weight (Vajan)" className="font-bold text-blue-600">
      <option value="kg" className="text-slate-700">Kilogram (kg)</option>
      <option value="g" className="text-slate-700">Gram (g)</option>
      <option value="mg" className="text-slate-700">Milligram (mg)</option>
      <option value="ton" className="text-slate-700">Metric Ton</option>
      <option value="lb" className="text-slate-700">Pound (lb)</option>
    </optgroup>

    {/* Volume Units (Liquid) */}
    <optgroup label="Volume / Liquid" className="font-bold text-blue-600">
      <option value="ltr" className="text-slate-700">Litre (ltr)</option>
      <option value="ml" className="text-slate-700">Millilitre (ml)</option>
      <option value="gal" className="text-slate-700">Gallon</option>
    </optgroup>

    {/* Counting Units (Ginti) */}
    <optgroup label="Counting / Pieces" className="font-bold text-blue-600">
      <option value="pc" className="text-slate-700">Piece (pc)</option>
      <option value="pack" className="text-slate-700">Pack</option>
      <option value="box" className="text-slate-700">Box</option>
      <option value="dozen" className="text-slate-700">Dozen</option>
      <option value="set" className="text-slate-700">Set</option>
      <option value="bundle" className="text-slate-700">Bundle</option>
      <option value="roll" className="text-slate-700">Roll</option>
      <option value="pair" className="text-slate-700">Pair</option>
    </optgroup>
  </select>
</div>
          </div>
        </div>

        {/* PRICING & STOCK */}
       <div className="bg-white rounded shadow-sm border">
  {/* Header Section */}
  <div className="px-6 py-4 border-b bg-slate-50 flex items-center gap-2 font-bold uppercase text-xs text-blue-900">
    <Info size={18} className="text-blue-500" /> Pricing & others
  </div>

  {/* Input Fields Grid */}
  <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-6">
    {/* Unit Price */}
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-bold text-slate-500 uppercase italic flex items-center gap-1">
        Unit Price (₹) <Info size={12} className="text-slate-400" />
      </label>
      <input 
        type="number" 
        className="w-full border rounded-lg p-2.5 outline-none focus:border-blue-400" 
        value={formData.unitPrice} 
        onChange={e => setFormData({ ...formData, unitPrice: e.target.value })} 
        required 
      />
    </div>

    {/* Minimum Order Qty */}
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-bold text-slate-500 uppercase italic flex items-center gap-1">
        Minimum Order Qty <Info size={12} className="text-slate-400" />
      </label>
      <input 
        type="number" 
        className="w-full border rounded-lg p-2.5 outline-none focus:border-blue-400" 
        value={formData.minOrderQty} 
        onChange={e => setFormData({ ...formData, minOrderQty: e.target.value })} 
      />
    </div>

    {/* Current Stock Qty */}
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-bold text-slate-500 uppercase italic flex items-center gap-1">
        Current Stock Qty <Info size={12} className="text-slate-400" />
      </label>
      <input 
        type="number" 
        className="w-full border rounded-lg p-2.5 outline-none focus:border-blue-400" 
        value={formData.currentStockQty} 
        onChange={e => setFormData({ ...formData, currentStockQty: e.target.value })} 
      />
    </div>

    {/* Discount Type */}
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-bold text-slate-500 uppercase italic flex items-center gap-1">
        Discount Type <Info size={12} className="text-slate-400" />
      </label>
      <select 
        className="w-full border rounded-lg p-2.5 bg-white outline-none focus:border-blue-400" 
        value={formData.discountType} 
        onChange={e => setFormData({ ...formData, discountType: e.target.value })}
      >
        <option value="Flat">Flat</option>
        <option value="Percent">Percent</option>
      </select>
    </div>

    {/* Discount Amount */}
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-bold text-slate-500 uppercase italic flex items-center gap-1">
        Discount Amount (₹) <Info size={12} className="text-slate-400" />
      </label>
      <input 
        type="number" 
        className="w-full border rounded-lg p-2.5 outline-none focus:border-blue-400" 
        value={formData.discountAmount} 
        onChange={e => setFormData({ ...formData, discountAmount: e.target.value })} 
      />
    </div>

    {/* Tax Amount */}
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-bold text-slate-500 uppercase italic flex items-center gap-1">
        Tax Amount (%) <Info size={12} className="text-slate-400" />
      </label>
      <input 
        type="number" 
        className="w-full border rounded-lg p-2.5 outline-none focus:border-blue-400" 
        value={formData.taxAmount} 
        onChange={e => setFormData({ ...formData, taxAmount: e.target.value })} 
      />
    </div>

    {/* Tax Calculation */}
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-bold text-slate-500 uppercase italic flex items-center gap-1">
        Tax Calculation <Info size={12} className="text-slate-400" />
      </label>
      <select 
        className="w-full border rounded-lg p-2.5 bg-white outline-none focus:border-blue-400" 
        value={formData.taxCalculation} 
        onChange={e => setFormData({ ...formData, taxCalculation: e.target.value })}
      >
        <option value="Include with product">Include with product</option>
        <option value="Exclude from product">Exclude from product</option>
      </select>
    </div>

    {/* Shipping Cost */}
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-bold text-slate-500 uppercase italic flex items-center gap-1">
        Shipping Cost (₹) <Info size={12} className="text-slate-400" />
      </label>
      <input 
        type="number" 
        className="w-full border rounded-lg p-2.5 outline-none focus:border-blue-400" 
        value={formData.shippingCost} 
        onChange={e => setFormData({ ...formData, shippingCost: e.target.value })} 
      />
    </div>
  </div>

  {/* SHIPPING MULTIPLY TOGGLE */}
  <div className="px-6 pb-4">
    <div className="flex items-center justify-between border rounded-lg p-4 bg-slate-50 max-w-md group hover:border-blue-200 transition-colors">
      <div className="flex items-center gap-2 text-xs font-bold text-slate-600 uppercase italic">
        Shipping Cost Multiply With Quantity <Info size={14} className="text-slate-400" />
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input 
          type="checkbox" 
          className="sr-only peer" 
          checked={formData.multiplyQty} 
          onChange={e => setFormData({ ...formData, multiplyQty: e.target.checked })} 
        />
        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
      </label>
    </div>
  </div>
</div>

        {/* PRODUCT TAGS TOGGLES */}
        <div className="bg-white rounded shadow-sm border p-6">
          <div className="flex items-center gap-2 font-bold uppercase text-xs mb-4 text-blue-900">
            <Info size={18} className="text-blue-500" /> Product Tags
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* New Arrival Toggle */}
            <div className="flex items-center justify-between border rounded-lg p-4 bg-green-50 max-w-md group hover:border-green-200 transition-colors">
              <div className="flex items-center gap-2 text-xs font-bold text-green-700 uppercase italic">
                Mark as New Arrival
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={formData.is_new_arrival} 
                  onChange={e => setFormData({ ...formData, is_new_arrival: e.target.checked })} 
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
              </label>
            </div>

            {/* Bestseller Toggle */}
            <div className="flex items-center justify-between border rounded-lg p-4 bg-amber-50 max-w-md group hover:border-amber-200 transition-colors">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-700 uppercase italic">
                Mark as Bestseller
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={formData.is_bestseller} 
                  onChange={e => setFormData({ ...formData, is_bestseller: e.target.checked })} 
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* IMAGES */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded border shadow-sm">
                <label className="block font-bold mb-4 uppercase text-xs italic text-blue-600">Main Thumbnail (1:1)</label>
                <div className="border-2 border-dashed rounded p-4 text-center relative cursor-pointer bg-slate-50 min-h-[150px] flex items-center justify-center">
                    {thumbnail ? <img src={URL.createObjectURL(thumbnail)} className="h-32 object-contain" /> : <ImageIcon size={40} className="text-slate-300" />}
                    <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e=>setThumbnail(e.target.files[0])} />
                </div>
            </div>

            <div className="bg-white p-6 rounded border shadow-sm">
                <label className="block font-bold mb-4 uppercase text-xs italic text-blue-600">Gallery Images (Multiple)</label>
                <div className="flex flex-wrap gap-2">
                    {additionalImages.map((img, i) => (
                        <div key={i} className="w-20 h-20 border rounded relative group shadow-sm bg-white p-1">
                            <img src={URL.createObjectURL(img)} className="w-full h-full object-cover rounded" />
                            <button type="button" onClick={()=>setAdditionalImages(additionalImages.filter((_, idx)=>idx!==i))} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-700 shadow-md">
                                <Trash size={10} />
                            </button>
                        </div>
                    ))}
                    <div className="w-20 h-20 border-2 border-dashed rounded flex flex-col items-center justify-center relative cursor-pointer bg-slate-50 hover:bg-blue-50 hover:border-blue-300 transition-all">
                        <Plus className="text-slate-400" />
                        <span className="text-[8px] font-bold text-slate-400">ADD</span>
                        <input type="file" multiple className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleAdditionalImages} />
                    </div>
                </div>
            </div>
        </div>

        <div className="flex justify-end gap-4 pb-10">
          <button type="reset" onClick={() => {setAdditionalImages([]); setThumbnail(null)}} className="px-10 py-3 bg-slate-400 text-white rounded font-bold hover:bg-slate-500 shadow-md transition-all uppercase text-sm">Reset</button>
          <button type="submit" className="px-10 py-3 bg-[#0067FF] text-white rounded font-bold shadow-xl flex items-center gap-2 hover:bg-blue-700 transition-all uppercase text-sm">
            <Save size={18} /> Publish Product
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;