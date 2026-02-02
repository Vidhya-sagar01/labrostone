import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ChevronLeft, ChevronRight, Leaf } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ShopByCategory = () => {
  const [categories, setCategories] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // ✅ LIVE BACKEND URL
  const API_BASE = "https://labrostone-backend.onrender.com";
  const itemsToShow = 5; 

  // ✅ HELPER: Localhost URL ko Live URL mein badalne ke liye
  const getImageUrl = (url) => {
    if (!url) return "https://placehold.co/400x500?text=No+Image";
    
    // Agar url array hai toh pehla element lo
    const path = Array.isArray(url) ? url[0] : url;

    if (typeof path === 'string' && path.includes('localhost:5000')) {
      return path.replace('http://localhost:5000', API_BASE);
    }
    return path;
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_BASE}/api/categories`);
        
        // Backend response check: Categories ko state mein set karein
        const catData = res.data.data || res.data.categories || res.data || [];
        setCategories(Array.isArray(catData) ? catData : []);
        
        setLoading(false);
      } catch (err) {
        console.error("Frontend Category Error:", err);
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const maxIndex = categories.length > itemsToShow ? categories.length - itemsToShow : 0;

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
  };

  if (loading) return (
    <div className="flex justify-center py-20 bg-white italic font-black text-slate-300 animate-pulse uppercase">
      LOADING CATEGORIES...
    </div>
  );

  return (
    <div className="py-12 bg-white">
      <div className="container mx-auto px-4">
        
        <h2 className="text-3xl font-black text-center mb-10 text-slate-900 uppercase italic tracking-tighter">
          Shop By Category
        </h2>

        <div className="relative group px-4 md:px-12">
          
          <div className="overflow-hidden w-full rounded-[2.5rem]">
            <div 
              className="flex transition-transform duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)]"
              style={{ transform: `translateX(-${currentIndex * (100 / itemsToShow)}%)` }}
            >
              {categories.map((cat) => (
                <div 
                  key={cat._id} 
                  className="flex-shrink-0 px-3 cursor-pointer"
                  style={{ width: `${100 / itemsToShow}%` }}
                  onClick={() => navigate(`/shop?category=${cat._id}`)}
                >
                  <div className="relative w-full aspect-[4/5] rounded-[2rem] overflow-hidden group/card bg-slate-100 shadow-sm hover:shadow-xl transition-all">
                    
                    {/* ✅ FIX: getImageUrl function ka use karein */}
                    <img 
                      src={getImageUrl(cat.image_url || cat.image)} 
                      alt={cat.name} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-110"
                      onError={(e) => { 
                        e.target.onerror = null; 
                        e.target.src = "https://placehold.co/400x500?text=No+Image"; 
                      }}
                    />
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>

                    <div className="absolute bottom-6 left-0 right-0 px-4 text-center text-white">
                      <div className="flex justify-center mb-2">
                        <Leaf size={18} className="text-emerald-400" />
                      </div>
                      <p className="text-[10px] font-black uppercase tracking-[0.2em]">
                        {cat.name}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {categories.length > itemsToShow && (
            <>
              <button onClick={prevSlide} className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-400 border border-slate-100 shadow-xl opacity-0 group-hover:opacity-100 transition-all">
                <ChevronLeft size={20} />
              </button>
              <button onClick={nextSlide} className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-400 border border-slate-100 shadow-xl opacity-0 group-hover:opacity-100 transition-all">
                <ChevronRight size={20} />
              </button>
            </>
          )}

        </div>
      </div>
    </div>
  );
};

export default ShopByCategory;