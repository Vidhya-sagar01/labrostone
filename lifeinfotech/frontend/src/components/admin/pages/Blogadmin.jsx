import React, { useState, useEffect } from 'react';
import instance, { getImageUrl } from '../../web/api/AxiosConfig';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { Upload, Plus, Loader2, BookOpen, Trash2 } from 'lucide-react';

const Blogadmin= () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const [formData, setFormData] = useState({ 
        title: '', 
        shortDescription: '', 
        longDescription: '', 
        image: null 
    });

    useEffect(() => { fetchBlogs(); }, []);

    const fetchBlogs = async () => {
        const res = await instance.get("/api/blogs/all");
        setBlogs(res.data);
    };

    const handleAddBlog = async (e) => {
        e.preventDefault();
        setLoading(true);
        const data = new FormData();
        data.append('title', formData.title);
        data.append('shortDescription', formData.shortDescription);
        data.append('longDescription', formData.longDescription); // Rich text HTML
        data.append('image', formData.image);

        try {
            const token = localStorage.getItem('adminToken');
            await instance.post("/api/blogs/add", data, {
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
            });
            alert("Blog Published! 🚀");
            setFormData({ title: '', shortDescription: '', longDescription: '', image: null });
            setImagePreview(null);
            fetchBlogs();
        } catch (err) { alert("Error adding blog"); }
        finally { setLoading(false); }
    };

    return (
        <div className="p-6 md:p-10 bg-[#F9FAFB] min-h-screen font-sans">
            <h1 className="text-3xl font-black uppercase  tracking-tighter text-slate-800 mb-8 flex items-center gap-3">
                <BookOpen className="text-blue-600" size={32} /> Blog <span className="text-blue-600">Management</span>
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Form Section */}
                <div className="lg:col-span-7">
                    <form onSubmit={handleAddBlog} className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-200 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <input required placeholder="Blog Title" className="w-full bg-slate-50 p-4 rounded-2xl outline-none font-bold ring-1 ring-slate-100" 
                                value={formData.title} onChange={(e)=>setFormData({...formData, title:e.target.value})} />
                                
                                <textarea required placeholder="Short Description (for card)" className="w-full bg-slate-50 p-4 rounded-2xl h-24 outline-none resize-none ring-1 ring-slate-100" 
                                value={formData.shortDescription} onChange={(e)=>setFormData({...formData, shortDescription:e.target.value})} />
                            </div>
                            
                            <label className="border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center cursor-pointer overflow-hidden bg-slate-50 h-full min-h-[200px]">
                                {imagePreview ? <img src={imagePreview} className="w-full h-full object-cover" /> : <><Upload className="text-slate-300" /> <span className="text-[10px] font-black uppercase text-slate-400 mt-2">Upload Blog Image</span></>}
                                <input type="file" hidden onChange={(e)=>{setFormData({...formData, image:e.target.files[0]}); setImagePreview(URL.createObjectURL(e.target.files[0]))}} />
                            </label>
                        </div>

                        {/* Rich Text Editor */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Description (EN)</label>
                            <div className="bg-white rounded-2xl overflow-hidden ring-1 ring-slate-100">
                                <ReactQuill 
                                    theme="snow" 
                                    value={formData.longDescription} 
                                    onChange={(content) => setFormData({...formData, longDescription: content})}
                                    placeholder="Write your blog content here..."
                                    className="h-64 mb-12"
                                />
                            </div>
                        </div>

                        <button disabled={loading} className="w-full bg-slate-900 text-white p-5 rounded-2xl font-black uppercase text-xs tracking-widest flex items-center justify-center gap-2 hover:bg-blue-600 transition-all">
                            {loading ? <Loader2 className="animate-spin" /> : <><Plus size={18} /> Publish Blog</>}
                        </button>
                    </form>
                </div>

                {/* List Section */}
                <div className="lg:col-span-5 space-y-4">
                    <h3 className="font-black uppercase text-xs text-slate-400 tracking-widest ml-4">Recent Blogs</h3>
                    {blogs.map(blog => (
                        <div key={blog._id} className="bg-white p-4 rounded-3xl shadow-sm border border-slate-200 flex gap-4 group">
                            <img src={getImageUrl(blog.image)} className="w-24 h-24 rounded-2xl object-cover" alt="" />
                            <div className="flex-1">
                                <h4 className="font-bold text-slate-800 line-clamp-1">{blog.title}</h4>
                                <p className="text-[11px] text-slate-500 line-clamp-2 mt-1">{blog.shortDescription}</p>
                                <button className="mt-2 text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-all opacity-0 group-hover:opacity-100">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Blogadmin;