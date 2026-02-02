import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus, Trash2, X, Edit, ArrowLeft } from 'lucide-react';

// LIVE BACKEND URL
const API_BASE = "https://labrostone-backend.onrender.com";
axios.defaults.baseURL = API_BASE;

const ProductbycategoryID = () => {
    const { categoryId } = useParams();
    const navigate = useNavigate();

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [seasons, setSeasons] = useState([]);

    const [currentPage, setCurrentPage] = useState(1);

    const initialFormState = {
        name: '',
        category_id: categoryId,
        season: '',
        short_description: '',
        long_description: '',
        how_to_use: '',
        in_stock: true,
        is_bestseller: false,
        rating: 4.5,
        reviews_count: 0,
        images: [],
        variants: [{ size: '', mrp: '', selling_price: '' }],
        features: [{ title: '', description: '' }],
        faqs: [{ question: '', answer: '' }]
    };

    const [formData, setFormData] = useState(initialFormState);

    // ✅ HELPER: Image URL Fix (Localhost to Live)
    const getImageUrl = (imagePath) => {
        if (!imagePath) return "https://via.placeholder.com/150";
        // Agar array hai toh pehla element lo
        const path = Array.isArray(imagePath) ? imagePath[0] : imagePath;
        if (path.includes('localhost:5000')) {
            return path.replace('http://localhost:5000', API_BASE);
        }
        return path;
    };

    const getAuthHeader = () => {
        const token = localStorage.getItem('adminToken');
        return { headers: { 'Authorization': `Bearer ${token}` } };
    };

    useEffect(() => { 
        fetchProducts(); 
        fetchSeasons();
    }, [categoryId]);

    const fetchSeasons = async () => {
        try {
            const res = await axios.get(`/api/seasons`);
            if (res.data.success) setSeasons(res.data.seasons);
        } catch (err) { console.error("Seasons Fetch Error"); }
    };

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`/api/products/by-category/${categoryId}`);
            setProducts(response.data.data || []);
            setLoading(false);
        } catch (error) {
            setProducts([]);
            setLoading(false);
        }
    };

    // --- HANDLERS ---
    const addArrayItem = (field) => {
        const newItem = field === 'variants' ? { size: '', mrp: '', selling_price: '' } :
                        field === 'features' ? { title: '', description: '' } : { question: '', answer: '' };
        setFormData({ ...formData, [field]: [...formData[field], newItem] });
    };

    const removeArrayItem = (field, index) => {
        const updatedArray = formData[field].filter((_, i) => i !== index);
        setFormData({ ...formData, [field]: updatedArray });
    };

    const handleArrayChange = (field, index, key, value) => {
        const updatedArray = [...formData[field]];
        updatedArray[index][key] = value;
        setFormData({ ...formData, [field]: updatedArray });
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked, files } = e.target;
        if (type === 'file') {
            const selectedFiles = Array.from(files);
            setFormData(prev => ({ ...prev, images: selectedFiles }));
            setImagePreviews(selectedFiles.map(file => URL.createObjectURL(file)));
        } else if (type === 'checkbox') {
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const openEditModal = (prod) => {
        setIsEditMode(true);
        setSelectedId(prod._id);
        setFormData({
            ...prod,
            variants: prod.variants?.length ? prod.variants : initialFormState.variants,
            features: prod.features?.length ? prod.features : initialFormState.features,
            faqs: prod.faqs?.length ? prod.faqs : initialFormState.faqs
        });
        setImagePreviews(Array.isArray(prod.images) ? prod.images : [prod.images]);
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        Object.keys(formData).forEach(key => {
            if (['variants', 'features', 'faqs'].includes(key)) {
                data.append(key, JSON.stringify(formData[key]));
            } else if (key === 'images') {
                if (formData.images[0] instanceof File) {
                    formData.images.forEach(img => data.append('images', img));
                }
            } else {
                data.append(key, formData[key]);
            }
        });

        try {
            const config = { headers: { ...getAuthHeader().headers, 'Content-Type': 'multipart/form-data' } };
            if (isEditMode) {
                await axios.put(`/api/products/${selectedId}`, data, config);
            } else {
                await axios.post(`/api/products`, data, config);
            }
            alert("Success! ✅");
            closeModal();
            fetchProducts();
        } catch (error) {
            alert(error.response?.data?.message || "Error saving product");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Delete this product permanently? 🗑️")) {
            try {
                await axios.delete(`/api/products/${id}`, getAuthHeader());
                alert("Deleted! 🗑️");
                fetchProducts();
            } catch (error) { alert("Delete Error! ❌"); }
        }
    };

    const closeModal = () => {
        setShowModal(false);
        setIsEditMode(false);
        setFormData(initialFormState);
        setImagePreviews([]);
    };

    const filteredItems = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="p-6 md:p-10 bg-slate-900 min-h-screen text-white">
            <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
                <div>
                    <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-blue-400 text-xs uppercase tracking-widest font-black hover:underline mb-2">
                        <ArrowLeft size={14} /> Back
                    </button>
                    <h1 className="text-4xl font-black italic tracking-tighter uppercase">Category Products</h1>
                </div>
                <div className="flex gap-4 w-full md:w-auto">
                    <input type="text" placeholder="Search product..." className="bg-slate-800 border border-slate-700 px-6 py-4 rounded-3xl outline-none focus:border-blue-500 flex-1 md:w-80" onChange={(e) => setSearchTerm(e.target.value)} />
                    <button onClick={() => setShowModal(true)} className="bg-blue-600 px-10 py-4 rounded-3xl font-black uppercase tracking-widest hover:scale-105 transition-all">+ Add</button>
                </div>
            </div>

            <div className="bg-slate-800 rounded-[3rem] border border-slate-700 overflow-hidden shadow-2xl overflow-x-auto">
                <table className="w-full text-left min-w-[1100px]">
                    <thead className="bg-slate-700/50 text-[11px] uppercase text-slate-400 font-black">
                        <tr>
                            <th className="p-8">Product Details</th>
                            <th className="p-8">Pricing (Primary)</th>
                            <th className="p-8">Status</th>
                            <th className="p-8 text-right pr-12">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/50">
                        {filteredItems.map((prod) => (
                            <tr key={prod._id} className="hover:bg-slate-700/20 transition-all">
                                <td className="p-8 flex items-center gap-6">
                                    <img src={getImageUrl(prod.images)} className="w-20 h-20 rounded-[1.5rem] object-cover border-2 border-slate-600" alt="" onError={(e) => e.target.src="https://via.placeholder.com/150"} />
                                    <div>
                                        <div className="font-black text-slate-100 uppercase text-lg">{prod.name}</div>
                                        <div className="text-[10px] text-slate-500 font-bold uppercase">{prod.variants?.[0]?.size}</div>
                                    </div>
                                </td>
                                <td className="p-8">
                                    <div className="text-2xl font-black text-emerald-400">₹{prod.variants?.[0]?.selling_price}</div>
                                    <div className="text-xs text-slate-500 font-bold italic line-through">₹{prod.variants?.[0]?.mrp}</div>
                                </td>
                                <td className="p-8">
                                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black ${prod.in_stock ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                                        {prod.in_stock ? '● IN STOCK' : '✖ OUT OF STOCK'}
                                    </span>
                                </td>
                                <td className="p-8 text-right pr-12 space-x-6">
                                    <button onClick={() => openEditModal(prod)} className="text-blue-400 font-black text-xs uppercase hover:underline">Edit</button>
                                    <button onClick={() => handleDelete(prod._id)} className="text-red-500 font-black text-xs uppercase hover:underline">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
               {showModal && (
                    <div className="fixed inset-0 bg-black/95 flex justify-center items-center z-50 p-4">
                        <div className="bg-slate-900 border border-slate-800 rounded-[3rem] w-full max-w-6xl max-h-[95vh] overflow-y-auto p-10 shadow-2xl relative scrollbar-hide">
                            
                            <div className="sticky -top-10 bg-slate-900 z-50 flex justify-between items-center mb-8 border-b border-slate-800 pb-6 pt-4">
                                <h2 className="text-3xl font-black text-blue-500 uppercase italic tracking-tighter">{isEditMode ? 'Modify Entry' : 'New Product Entry'}</h2>
                                <button onClick={closeModal} className="text-4xl text-slate-500 hover:text-white transition-all">&times;</button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-12">
                                {/* IDENTITY & PRICING */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    <div className="bg-slate-800/30 p-8 rounded-[2.5rem] border border-slate-800 space-y-4 shadow-inner">
                                        <label className="text-[10px] font-black text-blue-400 uppercase tracking-widest flex items-center gap-2"><ImageIcon size={14}/> Identity</label>
                                        <input name="name" value={formData.name} onChange={handleInputChange} placeholder="Name" className="w-full bg-slate-800 p-4 rounded-2xl outline-none" required />
                                        <input name="tagline" value={formData.tagline} onChange={handleInputChange} placeholder="Short Tagline" className="w-full bg-slate-800 p-4 rounded-2xl outline-none border border-slate-700" />
                                        <input name="net_content" value={formData.net_content} onChange={handleInputChange} placeholder="Net Content (e.g. 15g)" className="w-full bg-slate-800 p-4 rounded-2xl outline-none border border-slate-700" />
                                    </div>

                                    <div className="bg-slate-800/30 p-8 rounded-[2.5rem] border border-slate-800 shadow-inner">
                                        <label className="text-[10px] font-black text-emerald-400 uppercase tracking-widest flex items-center gap-2 mb-4"><PieChart size={14}/> Margin Analysis</label>
                                        <div className="grid grid-cols-3 gap-4">
                                            <input name="mrp" type="number" value={formData.mrp} onChange={handleInputChange} placeholder="MRP" className="bg-slate-800 p-3 rounded-xl outline-none text-center font-black" required />
                                            <input name="cost_price" type="number" value={formData.cost_price} onChange={handleInputChange} placeholder="Cost" className="bg-slate-800 p-3 rounded-xl outline-none text-center text-red-400 font-black" required />
                                            <input name="selling_price" type="number" value={formData.selling_price} onChange={handleInputChange} placeholder="Sale" className="bg-slate-800 p-3 rounded-xl outline-none text-center text-emerald-400 font-black" required />
                                        </div>
                                        <div className="flex justify-between mt-4 p-4 bg-slate-950/30 rounded-2xl border border-slate-700">
                                            <span className="text-[10px] font-bold text-orange-500 uppercase italic">Discount: {formData.discount_percentage}%</span>
                                            <span className="text-[10px] font-bold text-emerald-500 uppercase italic">Profit: ₹{formData.profit_amount}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* VARIANTS TABLE */}
                                <div className="bg-slate-800/30 p-8 rounded-[3rem] border border-slate-800 shadow-inner">
                                    <div className="flex justify-between items-center mb-6 border-b border-slate-700 pb-4">
                                        <label className="text-xs font-black text-blue-400 uppercase flex items-center gap-2"><Package size={16}/> Sizing Variants</label>
                                        <button type="button" onClick={() => addRow('pricing_variants', { size: '', mrp: '', sp: '', discount: 0 })} className="text-blue-500 font-bold text-[10px] uppercase hover:scale-110 transition-transform">+ Add size</button>
                                    </div>
                                    {formData.pricing_variants.map((v, i) => (
                                        <div key={i} className="flex gap-3 bg-slate-950/30 p-5 rounded-3xl border border-slate-700 items-center mb-4 transition-all">
                                            <input placeholder="Size" value={v.size} onChange={(e) => handleArrayChange('pricing_variants', i, 'size', e.target.value)} className="w-1/4 bg-slate-800 p-3 rounded-xl text-xs" />
                                            <input placeholder="MRP" type="number" value={v.mrp} onChange={(e) => handleArrayChange('pricing_variants', i, 'mrp', e.target.value)} className="w-1/4 bg-slate-800 p-3 rounded-xl text-xs" />
                                            <input placeholder="Sale" type="number" value={v.sp} onChange={(e) => handleArrayChange('pricing_variants', i, 'sp', e.target.value)} className="w-1/4 bg-slate-800 p-3 rounded-xl text-xs text-emerald-400 font-black" />
                                            {i > 0 && <XCircle size={24} className="text-red-500 cursor-pointer hover:scale-125 transition-all" onClick={() => removeRow('pricing_variants', i)} />}
                                        </div>
                                    ))}
                                </div>

                                {/* KEY FEATURES & FAQ SECTION */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* Features */}
                                    <div className="bg-slate-800/30 p-8 rounded-[2.5rem] border border-slate-800 shadow-inner">
                                        <div className="flex justify-between items-center mb-4">
                                            <label className="text-[10px] font-black text-emerald-400 uppercase tracking-widest flex items-center gap-2"><Star size={14}/> Key Features</label>
                                            <PlusCircle className="text-emerald-500 cursor-pointer" onClick={() => addRow('key_features', '')} />
                                        </div>
                                        {formData.key_features.map((f, i) => (
                                            <div key={i} className="flex gap-2 mb-3">
                                                <input value={f} onChange={(e) => handleArrayChange('key_features', i, null, e.target.value)} placeholder="Benefit Point" className="flex-1 bg-slate-800 p-3 rounded-xl text-xs border border-slate-700" />
                                                {i > 0 && <X onClick={() => removeRow('key_features', i)} className="text-red-500 cursor-pointer" />}
                                            </div>
                                        ))}
                                    </div>

                                    {/* FAQs */}
                                    <div className="bg-slate-800/30 p-8 rounded-[2.5rem] border border-slate-800 shadow-inner">
                                        <div className="flex justify-between items-center mb-4">
                                            <label className="text-[10px] font-black text-orange-400 uppercase tracking-widest flex items-center gap-2"><Info size={14}/> FAQs Section</label>
                                            <PlusCircle className="text-orange-500 cursor-pointer" onClick={() => addRow('faqs', {question:'', answer:''})} />
                                        </div>
                                        {formData.faqs.map((q, i) => (
                                            <div key={i} className="bg-slate-950/20 p-4 rounded-2xl relative border border-slate-700 mb-4 transition-all hover:border-slate-500">
                                                <input placeholder="Question" value={q.question} onChange={(e) => handleArrayChange('faqs', i, 'question', e.target.value)} className="w-full bg-slate-800 p-3 rounded-xl mb-2 text-xs font-bold" />
                                                <textarea placeholder="Answer" value={q.answer} onChange={(e) => handleArrayChange('faqs', i, 'answer', e.target.value)} className="w-full bg-slate-800 p-3 rounded-xl text-[10px] h-20" />
                                                {i > 0 && <XCircle size={18} className="absolute -top-2 -right-2 text-red-500 cursor-pointer bg-slate-900 rounded-full" onClick={() => removeRow('faqs', i)} />}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* NARRATIVES: LONG DESC & HOW TO USE */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="bg-slate-800/30 p-8 rounded-[2.5rem] border border-slate-800 space-y-4">
                                        <label className="text-[10px] font-black text-blue-400 uppercase tracking-widest flex items-center gap-2"><BookOpen size={14}/> Application (How To Use)</label>
                                        <textarea name="how_to_use" value={formData.how_to_use} onChange={handleInputChange} placeholder="Instructions..." className="w-full bg-slate-800 p-5 rounded-3xl outline-none border border-slate-700 h-44 text-sm leading-relaxed" />
                                    </div>
                                    <div className="bg-slate-800/30 p-8 rounded-[2.5rem] border border-slate-800 space-y-4">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><AlignLeft size={14}/> Long Narrative</label>
                                        <textarea name="description" value={formData.description} onChange={handleInputChange} placeholder="Detailed Description..." className="w-full bg-slate-800 p-5 rounded-3xl outline-none border border-slate-700 h-44 text-sm leading-relaxed" />
                                    </div>
                                </div>

                                {/* MULTIPLE IMAGE GALLERY */}
                                <div className="bg-slate-800/30 p-10 rounded-[3rem] border-2 border-dashed border-slate-700 text-center shadow-inner">
                                    <label className="text-xs font-black text-blue-400 uppercase mb-4 block flex items-center justify-center gap-2 font-black uppercase tracking-widest"><ImageIcon size={24}/> Product Visuals</label>
                                    <input type="file" multiple onChange={handleImageChange} className="hidden" id="file-up" />
                                    <label htmlFor="file-up" className="bg-slate-800 px-10 py-3 rounded-2xl cursor-pointer hover:bg-slate-700 border border-slate-600 font-bold transition-all inline-block">Upload Gallery</label>
                                    
                                    <div className="grid grid-cols-3 md:grid-cols-6 gap-4 mt-8">
                                        {imagePreviews.map((src, i) => (
                                            <div key={i} className="relative aspect-square group">
                                                <img src={src} className="w-full h-full rounded-2xl object-cover border-2 border-slate-700 shadow-2xl transition-all group-hover:scale-105" alt=""/>
                                                <button type="button" onClick={() => {
                                                    setFormData(prev => ({ ...prev, images: prev.images.filter((_, idx) => idx !== i) }));
                                                    setImagePreviews(prev => prev.filter((_, idx) => idx !== i));
                                                }} className="absolute -top-2 -right-2 bg-red-600 rounded-full p-1 shadow-xl"><X size={14}/></button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <button type="submit" className="sticky bottom-0 w-full bg-blue-600 hover:bg-blue-500 p-8 rounded-[3.5rem] font-black uppercase tracking-[0.5em] shadow-2xl transition-all active:scale-95 text-lg flex items-center justify-center gap-4 border-t-4 border-blue-400">
                                    <Save size={24}/> Authorize & Sync Data
                                </button>
                            </form>
                        </div>
                    </div>
                )}

};

export default ProductbycategoryID;
