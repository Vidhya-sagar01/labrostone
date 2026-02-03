import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    Plus, Trash2, X, Edit, ArrowLeft, Save, 
    BookOpen, AlignLeft, PieChart, Star, PlusCircle, 
    XCircle, Package, Info, DollarSign, Image as ImageIcon 
} from 'lucide-react';

// LIVE BACKEND URL
const API_BASE = "https://labrostone-backend.onrender.com";
axios.defaults.baseURL = API_BASE;

const ProductbycategoryID = () => {
    const { categoryId } = useParams();
    const navigate = useNavigate();

    // --- STATES ---
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [imagePreviews, setImagePreviews] = useState([]);

    // ✅ EXACT SCHEMA MATCHING STATE
    const initialFormState = {
        name: '',
        category_id: categoryId,
        tagline: '', 
        short_description: '',
        long_description: '',
        how_to_use: '',
        net_content: '',
        mrp: '', 
        cost_price: '', 
        selling_price: '', 
        discount_percentage: 0,
        profit_amount: 0,
        profit_percentage: 0,
        is_bestseller: false,
        in_stock: true,
        is_combo: false,
        variants: [{ size: '', mrp: '', cost: '', selling_price: '', discount: 0, profit: 0 }],
        features: [{ title: '', description: '' }],
        faqs: [{ question: '', answer: '' }], 
        images: [] 
    };

    const [formData, setFormData] = useState(initialFormState);

    // --- HELPERS ---
    const getImageUrl = (imagePath) => {
    if (!imagePath || (Array.isArray(imagePath) && imagePath.length === 0)) {
        return "https://via.placeholder.com/150";
    }
    const path = Array.isArray(imagePath) ? imagePath[0] : imagePath;

    // 1. Agar blob (preview) hai toh wahi dikhao
    if (path.startsWith('blob')) return path;

    // 2. Agar path mein pehle se localhost hai (purana data), toh use Live URL se badlo
    if (path.includes('localhost:5000')) {
        return path.replace('http://localhost:5000', API_BASE);
    }

    // 3. Naye data ke liye jo database mein "uploads/..." save ho raha hai
    const cleanPath = path.replace(/^\//, ''); // Shuruat ka slash hatao
    return `${API_BASE}/${cleanPath}`;
};

    const getAuthHeader = () => {
        const token = localStorage.getItem('adminToken');
        return { headers: { 'Authorization': `Bearer ${token}` } };
    };

    // --- API CALLS ---
    const fetchProducts = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`/api/products/by-category/${categoryId}`);
            setProducts(response.data.data || []);
        } catch (error) {
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchProducts(); }, [categoryId]);

    // --- HANDLERS ---
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        let nextState = { ...formData, [name]: type === 'checkbox' ? checked : value };
        
        // main economics auto-calc
        if (['mrp', 'selling_price', 'cost_price'].includes(name)) {
            const m = parseFloat(nextState.mrp) || 0;
            const s = parseFloat(nextState.selling_price) || 0;
            const c = parseFloat(nextState.cost_price) || 0;
            nextState.discount_percentage = m > s ? Math.round(((m - s) / m) * 100) : 0;
            nextState.profit_amount = s - c;
            nextState.profit_percentage = c > 0 ? Math.round(((s - c) / c) * 100) : 0;
        }
        setFormData(nextState);
    };

    const handleArrayChange = (field, index, key, value) => {
        const updated = [...formData[field]];
        if (key) updated[index][key] = value;
        else updated[index] = value;
        setFormData({ ...formData, [field]: updated });
    };

    const addRow = (field, obj) => setFormData(prev => ({ ...prev, [field]: [...prev[field], obj] }));
    const removeRow = (field, index) => setFormData(prev => ({ ...prev, [field]: prev[field].filter((_, i) => i !== index) }));

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setFormData(prev => ({ ...prev, images: [...prev.images, ...files] }));
        const newPreviews = files.map(file => URL.createObjectURL(file));
        setImagePreviews(prev => [...prev, ...newPreviews]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        const token = localStorage.getItem('adminToken');

        Object.keys(formData).forEach(key => {
            if (['variants', 'features', 'faqs'].includes(key)) {
                data.append(key, JSON.stringify(formData[key]));
            } else if (key === 'images') {
                formData.images.forEach(img => {
                    if (img instanceof File) data.append('images', img);
                    else data.append('existingImages', img);
                });
            } else {
                data.append(key, formData[key]);
            }
        });

        try {
            const config = { headers: { ...getAuthHeader().headers, 'Content-Type': 'multipart/form-data' } };
            if (isEditMode) await axios.put(`/api/products/${selectedId}`, data, config);
            else await axios.post(`/api/products`, data, config);
            alert("Database Updated! ✅");
            closeModal();
            fetchProducts();
        } catch (error) {
            alert("Sync Failed: Field mismatch or Server Error");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Delete Product?")) {
            try {
                await axios.delete(`/api/products/${id}`, getAuthHeader());
                fetchProducts();
            } catch (e) { alert("Delete Failed"); }
        }
    };

    const closeModal = () => {
        setShowModal(false);
        setIsEditMode(false);
        setFormData(initialFormState);
        setImagePreviews([]);
    };

    return (
        <div className="p-6 bg-slate-900 min-h-screen text-white font-sans">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-4xl font-black italic uppercase tracking-tighter">Lebroid <span className="text-blue-500">Pro</span></h1>
                        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-blue-400 text-xs mt-2 uppercase font-bold"><ArrowLeft size={14}/> Back</button>
                    </div>
                    <button onClick={() => setShowModal(true)} className="bg-blue-600 px-10 py-4 rounded-3xl font-black uppercase text-xs shadow-xl active:scale-95 transition-all">+ Add Product</button>
                </div>

                {/* ✅ TABLE WITH ALL FIELDS */}
                <div className="bg-slate-800 rounded-[3rem] border border-slate-700 overflow-hidden shadow-2xl overflow-x-auto">
                    <table className="w-full text-left min-w-[1100px]">
                        <thead className="bg-slate-700/50 text-[10px] font-black uppercase text-slate-400">
                            <tr>
                                <th className="p-8">Visual</th>
                                <th className="p-8">Details</th>
                                <th className="p-8">Price/Economics</th>
                                <th className="p-8">Status</th>
                                <th className="p-8 text-right pr-12">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700/50">
                            {products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase())).map((prod) => (
                                <tr key={prod._id} className="hover:bg-slate-700/20 transition-all">
                                    <td className="p-8">
                                        <img src={getImageUrl(prod.images)} className="w-16 h-16 rounded-2xl object-cover border border-slate-600" alt="" />
                                    </td>
                                    <td className="p-8">
                                        <div className="font-black text-white uppercase text-lg">{prod.name}</div>
                                        <div className="text-[10px] text-blue-400 font-bold uppercase">{prod.tagline || prod.net_content}</div>
                                    </td>
                                    <td className="p-8 italic font-black text-xl text-emerald-400">
                                        ₹{prod.selling_price}
                                        <div className="text-[9px] text-slate-500 uppercase not-italic">Profit: ₹{prod.profit_amount} ({prod.profit_percentage}%)</div>
                                    </td>
                                    <td className="p-8">
                                        <span className={`px-3 py-1 rounded-full text-[9px] font-black ${prod.in_stock ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                                            {prod.in_stock ? 'IN STOCK' : 'OUT OF STOCK'}
                                        </span>
                                    </td>
                                
                                        

                                    <td className="p-8 text-right pr-12 space-x-4">
                                        <button onClick={() => {
                                            setIsEditMode(true);
                                            setSelectedId(prod._id);
                                            setFormData({
                                                ...prod,
                                                variants: prod.variants || initialFormState.variants,
                                                features: prod.features || initialFormState.features,
                                                faqs: prod.faqs || initialFormState.faqs,
                                                long_description: prod.long_description || prod.description || ''
                                            });
                                            setImagePreviews(prod.images || []);
                                            setShowModal(true);
                                        }} className="text-blue-400 font-black text-xs uppercase hover:underline">Edit</button>
                                        <button onClick={() => handleDelete(prod._id)} className="text-red-500 font-black text-xs uppercase hover:underline">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* ✅ MODAL WITH ALL FIELDS */}
                {showModal && (
                    <div className="fixed inset-0 bg-black/95 flex justify-center items-center z-50 p-4">
                        <div className="bg-slate-900 border border-slate-800 rounded-[3rem] w-full max-w-6xl max-h-[95vh] overflow-y-auto p-10 shadow-2xl relative scrollbar-hide">
                            <div className="sticky -top-10 bg-slate-900 z-50 flex justify-between items-center mb-8 border-b border-slate-800 pb-6 pt-4 text-white">
                                <h2 className="text-3xl font-black uppercase italic text-blue-500">{isEditMode ? 'Modify Product' : 'New Entry'}</h2>
                                <button onClick={closeModal} className="text-4xl text-slate-500 hover:text-white transition-all">&times;</button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-12">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    <div className="bg-slate-800/30 p-8 rounded-[2.5rem] border border-slate-800 space-y-4">
                                        <label className="text-[10px] font-black text-blue-400 uppercase">General Info</label>
                                        <input name="name" value={formData.name} onChange={handleInputChange} placeholder="Product Name" className="w-full bg-slate-800 p-4 rounded-2xl outline-none" required />
                                        <input name="tagline" value={formData.tagline} onChange={handleInputChange} placeholder="Tagline" className="w-full bg-slate-800 p-4 rounded-2xl outline-none border border-slate-700" />
                                        <input name="net_content" value={formData.net_content} onChange={handleInputChange} placeholder="Net Content (e.g. 15g)" className="w-full bg-slate-800 p-4 rounded-2xl outline-none border border-slate-700" />
                                    </div>

                                    <div className="bg-slate-800/30 p-8 rounded-[2.5rem] border border-slate-800 shadow-inner">
                                        <label className="text-[10px] font-black text-emerald-400 uppercase flex items-center gap-2 mb-4 justify-center"><PieChart size={14}/> Margin Analysis</label>
                                        <div className="grid grid-cols-3 gap-4">
                                            <input name="mrp" type="number" value={formData.mrp} onChange={handleInputChange} placeholder="MRP ₹" className="bg-slate-800 p-3 rounded-xl outline-none text-center" />
                                            <input name="cost_price" type="number" value={formData.cost_price} onChange={handleInputChange} placeholder="Cost ₹" className="bg-slate-800 p-3 rounded-xl outline-none text-center text-red-400" />
                                            <input name="selling_price" type="number" value={formData.selling_price} onChange={handleInputChange} placeholder="Sale ₹" className="bg-slate-800 p-3 rounded-xl outline-none text-center text-emerald-400" />
                                        </div>
                                        <div className="mt-4 flex justify-between text-[10px] font-black text-blue-400 uppercase px-4">
                                            <span>PROFIT: {formData.profit_percentage}%</span>
                                            <span>DISCOUNT: {formData.discount_percentage}%</span>
                                        </div>
                                    </div>
                                </div>

                                {/* VARIANTS */}
                                <div className="bg-slate-800/30 p-8 rounded-[3rem] border border-slate-800">
                                    <div className="flex justify-between items-center mb-6">
                                        <label className="text-xs font-black text-blue-400 uppercase flex items-center gap-2"><Package size={16}/> Sizing Variants</label>
                                        <button type="button" onClick={() => addRow('variants', { size: '', mrp: '', selling_price: '' })} className="text-blue-500 font-bold text-[10px] uppercase">+ Add Size</button>
                                    </div>
                                    {formData.variants.map((v, i) => (
                                        <div key={i} className="flex gap-3 bg-slate-950/30 p-5 rounded-3xl border border-slate-700 items-center mb-4 transition-all">
                                            <input placeholder="Size" value={v.size} onChange={(e) => handleArrayChange('variants', i, 'size', e.target.value)} className="w-1/4 bg-slate-800 p-3 rounded-xl text-xs" />
                                            <input placeholder="MRP" type="number" value={v.mrp} onChange={(e) => handleArrayChange('variants', i, 'mrp', e.target.value)} className="w-1/4 bg-slate-800 p-3 rounded-xl text-xs font-black" />
                                            <input placeholder="Sale" type="number" value={v.selling_price} onChange={(e) => handleArrayChange('variants', i, 'selling_price', e.target.value)} className="w-1/4 bg-slate-800 p-3 rounded-xl text-xs font-black text-emerald-400" />
                                            {i > 0 && <button type="button" onClick={() => removeRow('variants', i)} className="text-red-500"><XCircle size={22}/></button>}
                                        </div>
                                    ))}
                                </div>

                                {/* LONG DESCRIPTIONS */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="bg-slate-800/30 p-8 rounded-[2.5rem] border border-slate-800 space-y-4">
                                        <label className="text-[10px] font-black text-blue-400 uppercase flex items-center gap-2"><BookOpen size={14}/> How To Use</label>
                                        <textarea name="how_to_use" value={formData.how_to_use} onChange={handleInputChange} placeholder="Step by step instructions..." className="w-full bg-slate-800 p-5 rounded-3xl outline-none border border-slate-700 h-44 text-sm leading-relaxed" />
                                    </div>
                                    <div className="bg-slate-800/30 p-8 rounded-[2.5rem] border border-slate-800 space-y-4">
                                        <label className="text-[10px] font-black text-slate-400 uppercase flex items-center gap-2"><AlignLeft size={14}/> Long Description</label>
                                        <textarea name="long_description" value={formData.long_description} onChange={handleInputChange} placeholder="Full product narrative..." className="w-full bg-slate-800 p-5 rounded-3xl outline-none border border-slate-700 h-44 text-sm leading-relaxed" />
                                    </div>
                                </div>

                                {/* FEATURES & FAQs */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    <div className="bg-slate-800/30 p-8 rounded-[2.5rem] border border-slate-800 space-y-4">
                                        <div className="flex justify-between items-center mb-2">
                                            <label className="text-[10px] font-black text-emerald-400 uppercase flex items-center gap-2"><Star size={14}/> Key Features</label>
                                            <PlusCircle size={18} className="text-emerald-500 cursor-pointer" onClick={() => addRow('features', {title: '', description: ''})}/>
                                        </div>
                                        {formData.features.map((f, i) => (
                                            <div key={i} className="flex gap-2">
                                                <input value={f.title} onChange={(e) => handleArrayChange('features', i, 'title', e.target.value)} placeholder="Feature Title" className="flex-1 bg-slate-800 p-3 rounded-xl text-xs border border-slate-700" />
                                                {i > 0 && <button type="button" onClick={() => removeRow('features', i)} className="text-red-500"><X size={16}/></button>}
                                            </div>
                                        ))}
                                    </div>
                                    <div className="bg-slate-800/30 p-8 rounded-[2.5rem] border border-slate-800 space-y-4">
                                        <div className="flex justify-between items-center mb-2">
                                            <label className="text-[10px] font-black text-orange-400 uppercase flex items-center gap-2"><Info size={14}/> FAQs Section</label>
                                            <PlusCircle size={18} className="text-orange-500 cursor-pointer" onClick={() => addRow('faqs', {question:'', answer:''})}/>
                                        </div>
                                        {formData.faqs.map((q, i) => (
                                            <div key={i} className="space-y-2 p-4 bg-slate-950/30 rounded-2xl relative border border-slate-700">
                                                <input placeholder="Question" value={q.question} onChange={(e) => handleArrayChange('faqs', i, 'question', e.target.value)} className="w-full bg-slate-800 p-2 rounded-xl text-xs font-bold" />
                                                <textarea placeholder="Answer" value={q.answer} onChange={(e) => handleArrayChange('faqs', i, 'answer', e.target.value)} className="w-full bg-slate-800 p-2 rounded-xl text-[10px]" />
                                                {i > 0 && <button type="button" onClick={() => removeRow('faqs', i)} className="text-red-500 absolute -top-2 -right-2"><XCircle size={18}/></button>}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* GALLERY */}
                                <div className="bg-slate-800/30 p-10 rounded-[3rem] border-2 border-dashed border-slate-700 text-center shadow-inner">
                                    <label className="text-xs font-black text-blue-400 uppercase mb-4 block flex items-center justify-center gap-2"><ImageIcon size={24}/> Product Assets</label>
                                    <input type="file" multiple onChange={handleImageChange} className="hidden" id="file-up" />
                                    <label htmlFor="file-up" className="bg-slate-800 px-10 py-3 rounded-2xl cursor-pointer hover:bg-slate-700 border border-slate-600 font-bold transition-all inline-block">Upload Assets</label>
                                    <div className="grid grid-cols-3 md:grid-cols-6 gap-4 mt-8">
                                        {imagePreviews.map((src, i) => (
                                            <div key={i} className="relative aspect-square group">
                                                <img src={getImageUrl(src)} className="w-full h-full rounded-2xl object-cover border-2 border-slate-700 shadow-2xl transition-all group-hover:scale-105" alt=""/>
                                                <button type="button" onClick={() => {
                                                    setFormData(prev => ({ ...prev, images: prev.images.filter((_, idx) => idx !== i) }));
                                                    setImagePreviews(prev => prev.filter((_, idx) => idx !== i));
                                                }} className="absolute -top-2 -right-2 bg-red-600 rounded-full p-1 shadow-xl"><X size={14}/></button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <button type="submit" className="sticky bottom-0 w-full bg-blue-600 hover:bg-blue-500 p-8 rounded-[3.5rem] font-black uppercase text-lg flex items-center justify-center gap-4 shadow-2xl transition-all active:scale-95 border-t-4 border-blue-400">
                                    <Save size={24}/> Commit to Database
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductbycategoryID;
