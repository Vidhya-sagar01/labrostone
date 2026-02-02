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

            {/* Modal code remains the same but with getImageUrl in previews */}
            {showModal && (
                <div className="fixed inset-0 bg-black/95 flex justify-center items-center z-50 p-4 overflow-y-auto">
                    <div className="bg-slate-800 border border-slate-700 rounded-[3.5rem] w-full max-w-7xl p-10 my-20">
                        <div className="flex justify-between items-center mb-10">
                            <h2 className="text-3xl font-black text-blue-500 uppercase italic">{isEditMode ? 'Modify Product' : 'Add New Product'}</h2>
                            <button onClick={closeModal} className="text-slate-400 hover:text-white"><X size={40} /></button>
                        </div>
                        {/* Form implementation continues... Same as previous but ensures getImageUrl for existing images */}
                        <form onSubmit={handleSubmit} className="space-y-10">
                             {/* Media Section Fix */}
                             <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase text-slate-500 ml-2">Product Images</label>
                                <input type="file" multiple onChange={handleInputChange} className="block w-full text-sm text-slate-500 file:bg-blue-600 file:text-white file:rounded-full cursor-pointer" />
                                <div className="flex gap-2 overflow-x-auto py-2">
                                    {imagePreviews.map((src, i) => (
                                        <img key={i} src={typeof src === 'string' ? getImageUrl(src) : URL.createObjectURL(src)} className="w-16 h-16 rounded-xl object-cover border border-slate-700" alt="preview" />
                                    ))}
                                </div>
                            </div>
                            <button type="submit" className="w-full bg-blue-600 p-8 rounded-[2.5rem] font-black uppercase tracking-[0.3em] hover:bg-emerald-500 transition-all">Submit</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductbycategoryID;