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

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [seasons, setSeasons] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    const initialFormState = {
        name: '',
        category_id: categoryId,
        season: '',
        tagline: '',
        short_description: '',
        long_description: '',
        description: '', 
        how_to_use: '',
        in_stock: true,
        is_bestseller: false,
        mrp: '',
        selling_price: '',
        discount_percentage: 0,
        profit_amount: 0,
        images: [],
        pricing_variants: [{ size: '', mrp: '', sp: '', discount: 0 }],
        key_features: [''],
        faqs: [{ question: '', answer: '' }]
    };

    const [formData, setFormData] = useState(initialFormState);

    // Image URL Helper
    const getImageUrl = (imagePath) => {
        if (!imagePath) return "https://via.placeholder.com/150";
        const path = Array.isArray(imagePath) ? imagePath[0] : imagePath;
        if (path.startsWith('http') || path.startsWith('blob')) return path;
        return `${API_BASE}/${path.replace(/\\/g, '/')}`;
    };

    const getAuthHeader = () => {
        const token = localStorage.getItem('adminToken');
        return { headers: { 'Authorization': `Bearer ${token}` } };
    };

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

    useEffect(() => { 
        fetchProducts(); 
    }, [categoryId]);

    // --- HANDLERS ---
    const calculateDiscount = (mrp, sp) => {
        const M = parseFloat(mrp) || 0;
        const S = parseFloat(sp) || 0;
        return M > S ? (((M - S) / M) * 100).toFixed(0) : 0;
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        let nextState = { ...formData, [name]: type === 'checkbox' ? checked : value };
        if (name === 'mrp' || name === 'selling_price') {
            nextState.discount_percentage = calculateDiscount(nextState.mrp, nextState.selling_price);
            nextState.profit_amount = (parseFloat(nextState.selling_price) || 0) - (parseFloat(nextState.cost_price) || 0);
        }
        setFormData(nextState);
    };

    const handleArrayChange = (field, index, key, value) => {
        const updatedArray = [...formData[field]];
        if (key) updatedArray[index][key] = value;
        else updatedArray[index] = value;
        setFormData({ ...formData, [field]: updatedArray });
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
        if (!token) return alert("Please Login! ❌");

        Object.keys(formData).forEach(key => {
            if (['pricing_variants', 'key_features', 'faqs'].includes(key)) {
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
            alert("Success! ✅");
            closeModal();
            fetchProducts();
        } catch (error) {
            alert("Error saving product");
        }
    };

    const closeModal = () => {
        setShowModal(false);
        setIsEditMode(false);
        setFormData(initialFormState);
        setImagePreviews([]);
    };

    const filteredItems = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const currentItems = filteredItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <div className="p-6 bg-slate-900 min-h-screen text-white font-sans">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-10">
                    <h1 className="text-4xl font-black italic uppercase tracking-tighter">Lebroid <span className="text-blue-500">Pro</span></h1>
                    <button onClick={() => setShowModal(true)} className="bg-blue-600 px-10 py-4 rounded-3xl font-black uppercase text-xs shadow-xl">+ Add Entry</button>
                </div>

                <div className="bg-slate-800 rounded-[3rem] border border-slate-700 overflow-hidden shadow-2xl overflow-x-auto">
                    <table className="w-full text-left min-w-[1000px]">
                        <thead className="bg-slate-700/50 text-[10px] font-black uppercase text-slate-400">
                            <tr>
                                <th className="p-8">Asset</th>
                                <th className="p-8">Price</th>
                                <th className="p-8 text-right pr-12">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700/50">
                            {currentItems.map((prod) => (
                                <tr key={prod._id} className="hover:bg-slate-700/20 transition-all">
                                    <td className="p-8 flex items-center gap-6">
                                        <img src={getImageUrl(prod.images)} className="w-16 h-16 rounded-2xl object-cover border border-slate-600" alt="" />
                                        <div>
                                            <div className="font-black text-white uppercase">{prod.name}</div>
                                            <div className="text-[10px] text-blue-400 font-bold uppercase">{prod.tagline}</div>
                                        </div>
                                    </td>
                                    <td className="p-8 text-emerald-400 font-black text-xl">₹{prod.selling_price || prod.variants?.[0]?.selling_price}</td>
                                    <td className="p-8 text-right pr-12 space-x-4">
                                        <button onClick={() => { setIsEditMode(true); setSelectedId(prod._id); setFormData({...prod, pricing_variants: prod.variants || []}); setShowModal(true); }} className="text-blue-400 font-black text-xs uppercase">Edit</button>
                                        <button onClick={() => handleDelete(prod._id)} className="text-red-500 font-black text-xs uppercase">Delete</button>
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
                                <h2 className="text-3xl font-black text-blue-500 uppercase italic tracking-tighter">Configure Product</h2>
                                <button onClick={closeModal} className="text-4xl text-slate-500 hover:text-white">&times;</button>
                            </div>
                            <form onSubmit={handleSubmit} className="space-y-12">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    <div className="bg-slate-800/30 p-8 rounded-[2.5rem] border border-slate-800 space-y-4">
                                        <label className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Base Identity</label>
                                        <input name="name" value={formData.name} onChange={handleInputChange} placeholder="Name" className="w-full bg-slate-800 p-4 rounded-2xl outline-none" required />
                                        <input name="tagline" value={formData.tagline} onChange={handleInputChange} placeholder="Tagline" className="w-full bg-slate-800 p-4 rounded-2xl outline-none border border-slate-700" />
                                    </div>
                                    <div className="bg-slate-800/30 p-8 rounded-[2.5rem] border border-slate-800 shadow-inner">
                                        <label className="text-[10px] font-black text-emerald-400 uppercase tracking-widest flex items-center gap-2 mb-4"><PieChart size={14}/> Margin Analysis</label>
                                        <div className="grid grid-cols-3 gap-4">
                                            <input name="mrp" type="number" value={formData.mrp} onChange={handleInputChange} placeholder="MRP ₹" className="bg-slate-800 p-3 rounded-xl outline-none font-black text-center" />
                                            <input name="cost_price" type="number" value={formData.cost_price} onChange={handleInputChange} placeholder="Cost ₹" className="bg-slate-800 p-3 rounded-xl outline-none font-black text-center text-red-400" />
                                            <input name="selling_price" type="number" value={formData.selling_price} onChange={handleInputChange} placeholder="Sale ₹" className="bg-slate-800 p-3 rounded-xl outline-none font-black text-center text-emerald-400" />
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-slate-800/30 p-8 rounded-[3rem] border border-slate-800">
                                    <div className="flex justify-between items-center mb-6 border-b border-slate-700 pb-4">
                                        <label className="text-xs font-black text-blue-400 uppercase flex items-center gap-2"><Package size={16}/> Sizing Variants</label>
                                        <button type="button" onClick={() => addRow('pricing_variants', { size: '', mrp: '', sp: '', discount: 0 })} className="text-blue-500 font-bold text-[10px] uppercase">+ Add size</button>
                                    </div>
                                    {formData.pricing_variants.map((v, i) => (
                                        <div key={i} className="flex gap-3 bg-slate-950/30 p-5 rounded-3xl border border-slate-700 items-center mb-4">
                                            <input placeholder="Size" value={v.size} onChange={(e) => handleArrayChange('pricing_variants', i, 'size', e.target.value)} className="w-1/4 bg-slate-800 p-3 rounded-xl text-xs" />
                                            <input placeholder="MRP" type="number" value={v.mrp} onChange={(e) => handleArrayChange('pricing_variants', i, 'mrp', e.target.value)} className="w-1/4 bg-slate-800 p-3 rounded-xl text-xs font-bold" />
                                            <input placeholder="Sale" type="number" value={v.sp} onChange={(e) => handleArrayChange('pricing_variants', i, 'sp', e.target.value)} className="w-1/4 bg-slate-800 p-3 rounded-xl text-xs font-bold text-emerald-400" />
                                            {i > 0 && <button type="button" onClick={() => removeRow('pricing_variants', i)} className="text-red-500"><XCircle size={22}/></button>}
                                        </div>
                                    ))}
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="bg-slate-800/30 p-8 rounded-[2.5rem] border border-slate-800 space-y-4">
                                        <div className="flex justify-between items-center">
                                            <label className="text-[10px] font-black text-emerald-400 uppercase tracking-widest flex items-center gap-2"><Star size={14}/> Key Features</label>
                                            <PlusCircle className="text-emerald-500 cursor-pointer" onClick={() => addRow('key_features', '')} />
                                        </div>
                                        {formData.key_features.map((f, i) => (
                                            <div key={i} className="flex gap-2">
                                                <input value={f} onChange={(e) => handleArrayChange('key_features', i, null, e.target.value)} className="flex-1 bg-slate-800 p-3 rounded-xl text-xs" />
                                                {i > 0 && <X onClick={() => removeRow('key_features', i)} className="text-red-500 cursor-pointer" />}
                                            </div>
                                        ))}
                                    </div>
                                    <div className="bg-slate-800/30 p-8 rounded-[2.5rem] border border-slate-800 space-y-4">
                                        <div className="flex justify-between items-center">
                                            <label className="text-[10px] font-black text-orange-400 uppercase tracking-widest flex items-center gap-2"><Info size={14}/> FAQs</label>
                                            <PlusCircle className="text-orange-500 cursor-pointer" onClick={() => addRow('faqs', {question:'', answer:''})} />
                                        </div>
                                        {formData.faqs.map((q, i) => (
                                            <div key={i} className="bg-slate-950/20 p-4 rounded-2xl relative">
                                                <input placeholder="Question" value={q.question} onChange={(e) => handleArrayChange('faqs', i, 'question', e.target.value)} className="w-full bg-slate-800 p-2 rounded-lg mb-2 text-xs font-bold" />
                                                <textarea placeholder="Answer" value={q.answer} onChange={(e) => handleArrayChange('faqs', i, 'answer', e.target.value)} className="w-full bg-slate-800 p-2 rounded-lg text-[10px]" />
                                                {i > 0 && <XCircle size={18} className="absolute -top-2 -right-2 text-red-500 cursor-pointer bg-slate-900 rounded-full" onClick={() => removeRow('faqs', i)} />}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="bg-slate-800/30 p-10 rounded-[3rem] border-2 border-dashed border-slate-700 text-center shadow-inner">
                                    <label className="text-xs font-black text-blue-400 uppercase mb-4 block flex items-center justify-center gap-2 font-black tracking-widest"><ImageIcon size={24}/> Product Assets</label>
                                    <input type="file" multiple onChange={handleImageChange} className="hidden" id="file-up" />
                                    <label htmlFor="file-up" className="bg-slate-800 px-10 py-3 rounded-2xl cursor-pointer hover:bg-slate-700 border border-slate-600 font-bold transition-all inline-block">Upload Gallery</label>
                                    <div className="grid grid-cols-3 md:grid-cols-6 gap-4 mt-8">
                                        {imagePreviews.map((src, i) => (
                                            <div key={i} className="relative aspect-square group">
                                                <img src={getImageUrl(src)} className="w-full h-full rounded-2xl object-cover border-2 border-slate-700 shadow-2xl transition-all" alt=""/>
                                                <button type="button" onClick={() => {
                                                    setFormData(prev => ({ ...prev, images: prev.images.filter((_, idx) => idx !== i) }));
                                                    setImagePreviews(prev => prev.filter((_, idx) => idx !== i));
                                                }} className="absolute -top-2 -right-2 bg-red-600 rounded-full p-1 shadow-xl"><X size={14}/></button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <button type="submit" className="sticky bottom-0 w-full bg-blue-600 hover:bg-blue-500 p-8 rounded-[3.5rem] font-black uppercase text-lg flex items-center justify-center gap-4 shadow-2xl transition-all active:scale-95 border-t-4 border-blue-400">
                                    <Save size={24}/> Sync & Authorize Data
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
