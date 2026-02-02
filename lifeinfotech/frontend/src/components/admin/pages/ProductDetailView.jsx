import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, Info, ArrowLeft, ShieldCheck, Zap, RefreshCw, Plus } from 'lucide-react';

const ProductDetailView = () => {
    const { productId } = useParams();
    const navigate = useNavigate();
    const [mainProduct, setMainProduct] = useState(null);
    const [activeDisplay, setActiveDisplay] = useState(null);
    const [selectedVariant, setSelectedVariant] = useState(0);
    const [mainImage, setMainImage] = useState("");
    const [loading, setLoading] = useState(true);

    const API_BASE = "https://labrostone-backend.onrender.com";

    // ✅ HELPER: Image URL ko Localhost se Live URL mein badalne ke liye
    const getImageUrl = (imagePath) => {
        if (!imagePath) return "https://via.placeholder.com/400";
        // Agar array hai toh pehla element lo
        const path = Array.isArray(imagePath) ? imagePath[0] : imagePath;
        if (path.includes('localhost:5000')) {
            return path.replace('http://localhost:5000', API_BASE);
        }
        return path;
    };
    
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const res = await axios.get(`${API_BASE}/api/products/${productId}`);
                if (res.data.success) {
                    const data = res.data.data;
                    setMainProduct(data);
                    setActiveDisplay(data); 
                    // ✅ Fix Image Path on Load
                    setMainImage(getImageUrl(data?.images));
                }
                setLoading(false);
            } catch (err) {
                console.error("Fetch Error:", err);
                setLoading(false);
            }
        };
        fetchProduct();
    }, [productId]);

    const switchProduct = (prod) => {
        setActiveDisplay(prod);
        // ✅ Fix Image Path on Switch
        setMainImage(getImageUrl(prod?.images));
        setSelectedVariant(0);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const getCombinedUsage = () => {
        if (activeDisplay?.how_to_use && activeDisplay.how_to_use !== "Instructions coming soon...") {
            return activeDisplay.how_to_use;
        }
        if (activeDisplay?.is_combo && activeDisplay.included_products) {
            return activeDisplay.included_products
                .map(p => `${p.name}: ${p.how_to_use}`)
                .join(" | ");
        }
        return activeDisplay?.how_to_use || "Instructions coming soon...";
    };

    const getCombinedFeatures = () => {
        if (activeDisplay?.features?.length > 0) return activeDisplay.features;
        if (activeDisplay?.is_combo && activeDisplay.included_products) {
            let allFeats = [];
            activeDisplay.included_products.forEach(p => {
                if (p.features) allFeats = [...allFeats, ...p.features];
            });
            return allFeats.slice(0, 6); 
        }
        return [];
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-white font-black text-emerald-500 animate-pulse uppercase tracking-widest">Loading...</div>;
    if (!mainProduct) return <div className="p-20 text-center text-red-500 font-bold uppercase tracking-widest">Data Not Found!</div>;

    return (
        <div className="bg-slate-50 min-h-screen pb-20 font-sans">
            {/* 1. HEADER */}
            <div className="bg-white border-b border-slate-100 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-600 hover:text-emerald-600 font-black uppercase text-[10px] tracking-widest">
                        <ArrowLeft size={16} /> Back to Dashboard
                    </button>
                    <div className="flex gap-3">
                        {mainProduct.is_combo && (
                            <button 
                                onClick={() => switchProduct(mainProduct)}
                                className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border transition-all shadow-sm ${activeDisplay?._id === mainProduct?._id ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-400 border-slate-100 hover:border-orange-500'}`}
                            >
                                🎁 View {mainProduct.name} Details
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 mt-8">
                {/* 2. TOP SECTION (Image & Price) */}
                <div className="bg-white rounded-[3.5rem] shadow-2xl overflow-hidden border border-slate-100">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                        <div className="p-10 border-r border-slate-50 bg-white">
                            <div className="relative aspect-square bg-slate-50 rounded-[3rem] overflow-hidden mb-6 group">
                                {/* ✅ Main Image Fix */}
                                <img src={mainImage} className="w-full h-full object-contain p-12 group-hover:scale-105 transition-all duration-700" alt="product" onError={(e) => e.target.src="https://via.placeholder.com/400"} />
                            </div>
                            <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                                {activeDisplay?.images?.map((img, i) => (
                                    <button key={i} onClick={() => setMainImage(getImageUrl(img))} className={`min-w-[80px] h-20 rounded-2xl border-2 overflow-hidden transition-all ${mainImage === getImageUrl(img) ? 'border-emerald-500 scale-105 shadow-md' : 'border-slate-100 opacity-40'}`}>
                                        <img src={getImageUrl(img)} className="w-full h-full object-cover" alt="" />
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="p-14 space-y-10">
                            <div>
                                <h1 className="text-5xl font-black text-slate-900 leading-none mb-6 uppercase italic tracking-tighter">
                                    {activeDisplay?.name}
                                </h1>
                                <p className="text-slate-400 text-lg font-bold leading-relaxed tracking-tight">{activeDisplay?.short_description}</p>
                            </div>

                            {/* ITEM SWITCHER */}
                            {mainProduct.is_combo && (
                                <div className="bg-slate-50 p-8 rounded-[3rem] border border-slate-200">
                                    <h4 className="text-[10px] font-black uppercase text-slate-400 mb-5 tracking-[0.3em]">Pack Includes:</h4>
                                    <div className="flex items-center gap-5">
                                        {mainProduct.included_products?.map((item, idx) => (
                                            <React.Fragment key={item?._id || idx}>
                                                <button 
                                                    onClick={() => switchProduct(item)}
                                                    className={`flex items-center gap-4 p-4 rounded-[2rem] transition-all border-2 ${activeDisplay?._id === item?._id ? 'bg-white border-emerald-500 shadow-xl scale-105' : 'bg-transparent border-transparent opacity-60 hover:opacity-100'}`}
                                                >
                                                    <img src={getImageUrl(item?.images)} className="w-14 h-14 rounded-2xl object-contain shadow-sm" alt="" />
                                                    <div className="text-left">
                                                        <div className="text-[10px] font-black text-slate-800 uppercase w-20 truncate italic">{item?.name}</div>
                                                    </div>
                                                </button>
                                                {idx < mainProduct.included_products.length - 1 && <Plus size={20} className="text-slate-300 animate-pulse" />}
                                            </React.Fragment>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="space-y-6">
                                <label className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300">Select Variant</label>
                                <div className="flex flex-wrap gap-5">
                                    {activeDisplay?.variants?.map((v, i) => (
                                        <button key={i} onClick={() => setSelectedVariant(i)} className={`flex-1 min-w-[160px] p-6 rounded-[2.5rem] border-2 text-left transition-all ${selectedVariant === i ? 'border-emerald-500 bg-emerald-50 shadow-lg' : 'border-slate-100'}`}>
                                            <div className="text-[9px] font-black uppercase text-slate-400 mb-1">{v.size}</div>
                                            <div className="text-2xl font-black text-slate-900 italic tracking-tighter">₹{v.selling_price}</div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. DYNAMIC DETAILS SECTION */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-16">
                    <div className="lg:col-span-2 space-y-12">
                        <div className="bg-white p-14 rounded-[3.5rem] shadow-sm border border-slate-100">
                            <h2 className="text-3xl font-black mb-12 flex items-center gap-4 italic uppercase text-slate-900 tracking-tighter">
                                <ShieldCheck className="text-emerald-500" size={32} /> Key Highlights
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                {getCombinedFeatures().map((feat, i) => (
                                    <div key={i} className="relative pl-8 group">
                                        <div className="absolute left-0 top-1 w-2 h-2 bg-emerald-500 rounded-full group-hover:scale-150 transition-all"></div>
                                        <h4 className="font-black text-slate-800 mb-2 uppercase text-xs tracking-widest">{feat.title}</h4>
                                        <p className="text-slate-400 text-xs leading-relaxed font-bold">{feat.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-slate-900 text-white p-16 rounded-[4rem] shadow-2xl relative overflow-hidden group">
                            <Zap className="absolute -right-16 -bottom-16 w-96 h-96 text-slate-800 opacity-30 group-hover:rotate-12 transition-all duration-700" />
                            <h2 className="text-3xl font-black mb-10 flex items-center gap-4 italic uppercase relative z-10 tracking-tighter">
                                <div className="w-12 h-12 bg-yellow-400 text-slate-900 rounded-full flex items-center justify-center not-italic text-sm">⚡</div> 
                                Directions to use
                            </h2>
                            <p className="text-slate-300 text-xl leading-relaxed relative z-10 font-black italic tracking-tight">
                                "{getCombinedUsage()}"
                            </p>
                        </div>
                    </div>

                    <div className="bg-white p-12 rounded-[3.5rem] shadow-sm border border-slate-100 h-fit">
                        <h2 className="text-2xl font-black mb-10 flex items-center gap-4 italic uppercase text-slate-900 tracking-tighter border-b pb-8 border-slate-50">
                            FAQ's
                        </h2>
                        <div className="space-y-10">
                            {(activeDisplay?.faqs?.length > 0 ? activeDisplay.faqs : (mainProduct.included_products?.[0]?.faqs || [])).map((f, i) => (
                                <div key={i} className="space-y-4 group">
                                    <div className="text-xs font-black text-slate-900 uppercase flex gap-3 italic">
                                        <span className="text-emerald-500 not-italic">Q.</span> {f.question}
                                    </div>
                                    <div className="text-xs text-slate-400 leading-relaxed bg-slate-50 p-6 rounded-3xl border border-slate-100 font-bold group-hover:border-emerald-200 transition-all">
                                        {f.answer}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailView;