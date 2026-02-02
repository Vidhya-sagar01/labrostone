import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Category = () => {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [pagination, setPagination] = useState({ current_page: 1, last_page: 1, total: 0 });
    const [currentPage, setCurrentPage] = useState(1);

    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const initialFormState = {
        name: '', image_url: null, min_price: '', max_price: '',
        discount_text: '', card_offers: '', festival_offers: ''
    };

    const [formData, setFormData] = useState(initialFormState);

    // Axios Base URL (Backend Port 5000)
    axios.defaults.baseURL = 'http://localhost:5000';

    // --- HELPER: Auth Header Setup ---
    const getAuthHeader = (isMultipart = false) => {
    const token = localStorage.getItem('adminToken');
    return {
        headers: {
            // "Bearer " lagane se standard auth follow hota hai
            'Authorization': token ? `Bearer ${token}` : '', 
            ...(isMultipart ? { 'Content-Type': 'multipart/form-data' } : {})
        }
    };
};
    useEffect(() => { fetchCategories(currentPage); }, [currentPage, searchTerm]);

    // 1. FETCH CATEGORIES (Protected)
    const fetchCategories = async (page = 1) => {
        setLoading(true);
        try {
            const response = await axios.get(`/api/categories?page=${page}&search=${searchTerm}`, getAuthHeader());
            setCategories(response.data.data || []);
            setPagination({
                current_page: response.data.current_page || 1,
                last_page: response.data.last_page || 1,
                total: response.data.total || 0
            });
            setLoading(false);
        } catch (error) {
            console.error("Fetch Error:", error);
            if (error.response?.status === 401) {
                navigate('/admin/login');
            }
            setLoading(false);
        }
    };

    const calculateDiscount = (min, max) => {
        if (min && max && Number(max) > Number(min)) {
            const discount = Math.round(((max - min) / max) * 100);
            return `Flat ${discount}% OFF`;
        }
        return '';
    };

    const handleInputChange = (e) => {
        const { name, value, type, files } = e.target;
        if (type === 'file') {
            const file = files[0];
            setFormData({ ...formData, [name]: file });
            setImagePreview(URL.createObjectURL(file));
        } else {
            const updatedData = { ...formData, [name]: value };
            if (name === 'min_price' || name === 'max_price') {
                updatedData.discount_text = calculateDiscount(updatedData.min_price, updatedData.max_price);
            }
            setFormData(updatedData);
        }
    };

    // 2. SUBMIT / UPDATE (Protected)
    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        Object.keys(formData).forEach(key => {
            if (formData[key] !== null) data.append(key, formData[key]);
        });

        try {
            const config = getAuthHeader(true);
            if (isEditMode) {
                await axios.put(`/api/categories/${selectedId}`, data, config);
            } else {
                await axios.post('/api/categories', data, config);
            }
            closeModal();
            fetchCategories(currentPage);
            alert("Success! Category Managed ✅");
        } catch (error) { 
            if (error.response?.status === 401) {
                alert("Session Expired! Please Login Again.");
                navigate('/admin/login');
            } else {
                alert("Error saving category! ❌"); 
            }
        }
    };

    const closeModal = () => {
        setShowModal(false);
        setIsEditMode(false);
        setFormData(initialFormState);
        setImagePreview(null);
    };

    // 3. DELETE (Protected)
    const confirmDelete = async () => {
        try {
            await axios.delete(`/api/categories/${selectedId}`, getAuthHeader());
            setShowDeleteModal(false);
            fetchCategories(currentPage);
            alert("Deleted! 🗑️");
        } catch (error) { 
            if (error.response?.status === 401) {
                navigate('/admin/login');
            } else {
                alert("Delete failed! ❌"); 
            }
        }
    };

    return (
        <div className="p-4 md:p-6 bg-slate-900 min-h-screen text-white">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <h1 className="text-2xl font-black text-blue-500 tracking-widest uppercase italic">Category Control</h1>
                <div className="flex w-full md:w-auto gap-4">
                    <input 
                        type="text" 
                        placeholder="Search inventory..." 
                        className="bg-slate-800 border border-slate-700 px-4 py-2 rounded-xl outline-none focus:border-blue-500 flex-1 md:w-64"
                        onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                    />
                    <button onClick={() => setShowModal(true)} className="bg-blue-600 px-6 py-2 rounded-xl font-bold hover:bg-blue-700 shadow-lg">+ Add New</button>
                </div>
            </div>

            {/* Table Area */}
            <div className="bg-slate-800 rounded-3xl border border-slate-700 overflow-hidden shadow-2xl mb-6">
                <table className="w-full text-left">
                    <thead className="bg-slate-700/50 text-[10px] uppercase text-slate-400 font-black tracking-widest">
                        <tr>
                            <th className="p-5">Category Info</th>
                            <th className="p-5">Pricing & Offers</th>
                            <th className="p-5 text-center">Manage</th>
                            <th className="p-5 text-right pr-10">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700">
                        {loading ? (
                            <tr><td colSpan="4" className="p-10 text-center font-bold animate-pulse uppercase italic">Syncing with Server...</td></tr>
                        ) : categories.length > 0 ? categories.map((cat) => (
                            <tr key={cat._id} className="hover:bg-slate-700/30 transition-all">
                                <td className="p-4 flex items-center gap-4">
                                    <img src={cat.image_url} className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-600" alt="" />
                                    <div>
                                        <div className="font-bold text-lg uppercase tracking-tighter">{cat.name}</div>
                                        <div className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded-full inline-block font-black mt-1">
                                            {cat.discount_text || 'No Active Offer'}
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4 text-xs font-medium">
                                    <div className="text-emerald-400 font-bold mb-1 underline decoration-emerald-500/30">₹{cat.min_price} - ₹{cat.max_price}</div>
                                    <div className="text-blue-400 text-[9px] italic">💳 {cat.card_offers || 'Standard Offers'}</div>
                                    <div className="text-yellow-500 text-[9px] italic">🎉 {cat.festival_offers || 'No Festival Offers'}</div>
                                </td>
                                <td className="p-4 text-center">
                                    <button onClick={() => navigate(`/admin/products/add/${cat._id}`)} className="bg-blue-600/10 text-blue-400 border border-blue-500/30 text-[10px] font-black px-4 py-2 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-md">+ PRODUCTS</button>
                                </td>
                                <td className="p-4 text-right pr-10 space-x-6">
                                    <button onClick={() => { setFormData(cat); setImagePreview(cat.image_url); setSelectedId(cat._id); setIsEditMode(true); setShowModal(true); }} className="text-blue-400 font-black text-[10px] uppercase hover:underline">Edit</button>
                                    <button onClick={() => { setSelectedId(cat._id); setShowDeleteModal(true); }} className="text-red-500 font-black text-[10px] uppercase hover:underline">Delete</button>
                                </td>
                            </tr>
                        )) : (
                            <tr><td colSpan="4" className="p-10 text-center text-slate-500 italic uppercase tracking-widest font-bold">No Records Found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center bg-slate-800 p-4 rounded-2xl border border-slate-700 shadow-xl">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest italic">Inventory Stats: {categories.length} loaded</span>
                <div className="flex gap-2">
                    <button disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)} className="px-4 py-2 bg-slate-700 rounded-xl text-[10px] font-black uppercase tracking-widest disabled:opacity-30">Prev</button>
                    <button disabled={currentPage === pagination.last_page} onClick={() => setCurrentPage(prev => prev + 1)} className="px-4 py-2 bg-blue-600 rounded-xl text-[10px] font-black uppercase tracking-widest disabled:opacity-30">Next</button>
                </div>
            </div>

            {/* --- MODAL (ADD/EDIT) --- */}
            {showModal && (
                <div className="fixed inset-0 bg-black/95 backdrop-blur-md flex justify-center items-center z-50 p-4 overflow-y-auto">
                    <div className="bg-slate-800 border border-slate-700 rounded-[2rem] w-full max-w-3xl shadow-2xl my-auto">
                        <div className="p-6 border-b border-slate-700 flex justify-between items-center">
                            <h2 className="text-xl font-black text-blue-500 uppercase italic tracking-widest">{isEditMode ? 'Modify Record' : 'New  Entry'}</h2>
                            <button onClick={closeModal} className="text-4xl font-thin hover:text-red-500 transition-colors">&times;</button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-500 uppercase ml-2 tracking-widest">Category Title</label>
                                <input name="name" value={formData.name} onChange={handleInputChange} required className="w-full bg-slate-900 border border-slate-700 p-4 rounded-2xl outline-none focus:border-blue-500 transition-all font-bold" placeholder="e.g. Healthcare" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-500 uppercase ml-2 tracking-widest">Computed Discount</label>
                                <input name="discount_text" value={formData.discount_text} className="w-full bg-slate-950 border border-slate-800 p-4 rounded-2xl text-emerald-500 font-black uppercase tracking-widest" readOnly />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-500 uppercase ml-2 tracking-widest">Base Price (₹)</label>
                                <input name="min_price" type="number" value={formData.min_price} onChange={handleInputChange} className="w-full bg-slate-900 border border-slate-700 p-4 rounded-2xl outline-none focus:border-blue-500 transition-all font-bold" required />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-500 uppercase ml-2 tracking-widest">Ceiling Price (₹)</label>
                                <input name="max_price" type="number" value={formData.max_price} onChange={handleInputChange} className="w-full bg-slate-900 border border-slate-700 p-4 rounded-2xl outline-none focus:border-blue-500 transition-all font-bold" required />
                            </div>
                            <div className="md:col-span-2 space-y-1">
                                <label className="text-[10px] font-black text-slate-500 uppercase ml-2 tracking-widest">Visual Asset (Image)</label>
                                <div className="flex gap-4 items-center p-4 bg-slate-950 rounded-2xl border border-slate-800 shadow-inner">
                                    <input type="file" name="image_url" onChange={handleInputChange} className="text-[10px] text-slate-500 file:bg-blue-600 file:border-none file:text-white file:rounded-lg file:px-4 file:py-1 file:mr-4 file:cursor-pointer hover:file:bg-blue-500" />
                                    {imagePreview && <img src={imagePreview} className="w-20 h-20 rounded-2xl object-cover border-4 border-slate-800 shadow-lg" />}
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-500 uppercase ml-2 tracking-widest">Banking Logic</label>
                                <textarea name="card_offers" value={formData.card_offers} onChange={handleInputChange} className="w-full bg-slate-900 border border-slate-700 p-4 rounded-2xl h-28 resize-none text-[11px] text-blue-400 italic font-bold" placeholder="Bank offers..."></textarea>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-500 uppercase ml-2 tracking-widest">Event Logic</label>
                                <textarea name="festival_offers" value={formData.festival_offers} onChange={handleInputChange} className="w-full bg-slate-900 border border-slate-700 p-4 rounded-2xl h-28 resize-none text-[11px] text-yellow-500 italic font-bold" placeholder="Seasonal discounts..."></textarea>
                            </div>
                            <button type="submit" className="md:col-span-2 bg-gradient-to-r from-blue-600 to-indigo-700 p-5 rounded-3xl font-black text-lg shadow-xl hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-widest shadow-blue-500/20">
                                {isEditMode ? 'Commit Database Update' : 'Initialize Category'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* --- DELETE CONFIRMATION --- */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black/90 flex justify-center items-center z-[100] backdrop-blur-sm">
                    <div className="bg-slate-800 p-10 rounded-[3rem] border border-slate-700 text-center max-w-sm shadow-2xl">
                        <div className="text-6xl mb-4 shadow-sm animate-bounce">⚠️</div>
                        <h2 className="text-2xl font-black mb-2 uppercase tracking-tighter italic text-red-500">Confirm Deletion</h2>
                        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-8">This action will permanently purge the record from the database.</p>
                        <div className="flex gap-4">
                            <button onClick={() => setShowDeleteModal(false)} className="flex-1 bg-slate-700 p-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-600 transition-all">Abort</button>
                            <button onClick={confirmDelete} className="flex-1 bg-red-600 p-4 rounded-2xl font-black text-white uppercase text-[10px] tracking-widest hover:bg-red-500 shadow-lg shadow-red-500/20 transition-all">Confirm</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Category;