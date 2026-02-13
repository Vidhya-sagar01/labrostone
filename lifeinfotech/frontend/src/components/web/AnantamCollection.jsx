import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ShoppingCart, RefreshCw, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AnantamCollection = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const defaultBanner = "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&q=80&w=1600";
  const [bannerUrl, setBannerUrl] = useState(localStorage.getItem('cached_anantam_banner') || defaultBanner);
  const [loading, setLoading] = useState(true);

  const API_BASE = "https://lebrostonebackend.lifeinfotechinstitute.com";

  // --- 1. URL CLEANER HELPER ---
  const getCleanUrl = (imagePath) => {
    if (!imagePath || imagePath.length === 0) return "";
    const path = Array.isArray(imagePath) ? imagePath[0] : imagePath;
    if (typeof path === 'string') {
      if (path.startsWith('http')) {
        return path.replace('https://lebrostonebackend.lifeinfotechinstitute.com', API_BASE)
                   .replace('https://lebrostone.lifeinfotechinstitute.com', API_BASE);
      }
      return `${API_BASE}/${path.replace(/^\//, '')}`;
    }
    return path;
  };

  // --- 2. IMAGE LOGIC (Smart Combo Fallback) ---
  const getProductDisplayImage = (product) => {
    // Priority 1: Product ki apni image
    if (product.images && product.images.length > 0) {
        return getCleanUrl(product.images);
    }
    
    // Priority 2: Agar Combo hai aur image nahi hai -> Included Product ki image
    if (product.is_combo && product.included_products?.length > 0) {
        const firstItem = product.included_products[0];
        
        // Agar populated object hai
        if (typeof firstItem === 'object' && firstItem.images?.length > 0) {
            return getCleanUrl(firstItem.images);
        }
    }

    // Priority 3: Placeholder
    return "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&q=80&w=500";
  };

  // --- 3. PRICE LOGIC (Strict Priority) ---
  const getProductPrice = (product) => {
    // 1. Root Price (Database Main Price)
    const rootSP = Number(product.selling_price);
    const rootMRP = Number(product.mrp);

    // ✅ Priority 1: Agar Root Price Set Hai (e.g. 500) -> Use Standard Price
    if (rootSP > 0) {
        return { 
            sp: rootSP, 
            mrp: rootMRP > 0 ? rootMRP : rootSP 
        };
    }

    // ✅ Priority 2: Agar Variants hain -> Use Variant Price
    if (product.variants && product.variants.length > 0 && product.variants.some(v => v.selling_price > 0)) {
        return {
            sp: Number(product.variants[0].selling_price),
            mrp: Number(product.variants[0].mrp)
        };
    }

    // ✅ Priority 3: Agar Combo hai aur upar ke prices 0 hain -> Calculation
    if (product.is_combo && product.included_products?.length > 0) {
        let totalSP = 0;
        let totalMRP = 0;
        
        product.included_products.forEach(item => {
            if (typeof item === 'object') { // Ensure item is populated
                const itemSP = Number(item.selling_price) || Number(item.variants?.[0]?.selling_price) || 0;
                const itemMRP = Number(item.mrp) || Number(item.variants?.[0]?.mrp) || 0;
                totalSP += itemSP;
                totalMRP += (itemMRP || itemSP);
            }
        });

        if (totalSP > 0) {
            return { sp: totalSP, mrp: totalMRP };
        }
    }

    // Fallback
    return { sp: 0, mrp: 0 };
  };

  useEffect(() => {
    const fetchAnantamData = async () => {
      try {
        const [bannerRes, productRes] = await Promise.all([
          axios.get(`${API_BASE}/api/products/banner`),
          axios.get(`${API_BASE}/api/products/anantam-collection`)
        ]);

        if (bannerRes.data.success && bannerRes.data.url) {
          const fixedBanner = getCleanUrl(bannerRes.data.url);
          setBannerUrl(fixedBanner);
          localStorage.setItem('cached_anantam_banner', fixedBanner);
        }

        if (productRes.data.success) {
          setProducts(productRes.data.data);
        }
      } catch (err) {
        console.error("Connection error.");
      } finally {
        setLoading(false);
      }
    };
    fetchAnantamData();
  }, []);

  if (loading && bannerUrl === defaultBanner) return (
    <div className="flex flex-col items-center justify-center py-40 bg-white">
      <RefreshCw className="animate-spin text-orange-400 mb-4" size={40} />
      <div className="italic font-black text-slate-300 animate-pulse uppercase tracking-widest text-center px-4 text-sm">
        PREPARING THE ANANTAM EXPERIENCE...
      </div>
    </div>
  );

  return (
    // ✅ Added overflow-hidden to main wrapper to prevent horizontal scroll
    <div className="py-12 bg-white selection:bg-orange-100 w-full overflow-hidden">
      
      {/* 1. BANNER SECTION */}
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="relative w-full h-[450px] md:h-[550px] bg-[#1a0f09] flex items-center justify-center overflow-hidden mb-16 rounded-[2.5rem] md:rounded-[4rem] shadow-2xl group">
          <div className="absolute inset-0">
             <img 
               src={bannerUrl} 
               className="w-full h-full object-cover opacity-60 transition-transform duration-[3s] group-hover:scale-110" 
               alt="Banner Background"
               onError={(e) => { e.target.src = defaultBanner; }}
             />
             <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent"></div>
          </div>

          <div className="container mx-auto px-6 md:px-20 relative z-10 flex flex-col justify-center h-full">
            <div className="max-w-2xl space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/20 backdrop-blur-md border border-orange-500/30">
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-orange-200">The Anantam Series</span>
              </div>
              <h2 className="text-4xl md:text-6xl lg:text-8xl font-serif leading-none text-white italic">
                Elevated <br /> <span className="text-orange-300">Self-Care.</span>
              </h2>
              <p className="text-sm md:text-lg text-white/70 font-light max-w-md leading-relaxed tracking-wide">
                Indulge in our most premium collection, where ancient Ayurveda meets modern luxury.
              </p>
              <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-full font-bold uppercase text-xs tracking-widest transition-all hover:px-10">
                Explore Collection
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. PRODUCT GRID SECTION */}
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex flex-col items-center mb-16 text-center w-full">
          <div className=" text-black py-3 px-12 md:px-24 ">
            <h2 className="text-lg md:text-2xl font-bold uppercase tracking-wider text-center ">
              The Collection
            </h2>
          </div>
        </div>

        {products.length === 0 && !loading ? (
          <div className="flex flex-col items-center justify-center py-32 bg-slate-50 rounded-[3rem]">
            <Package size={48} className="text-slate-300 mb-4" />
            <p className="text-slate-500 font-medium italic">Our curators are adding new treasures...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">
            {products.map((product) => {
              
              // ✅ Apply Logic Here
              const displayImage = getProductDisplayImage(product);
              const { sp, mrp } = getProductPrice(product);

              return (
                <div 
                  key={product._id} 
                  className="group flex flex-col cursor-pointer w-full" 
                  onClick={() => navigate(`/product/${product._id}`)} 
                >
                  <div className="relative w-full aspect-[3/4] mb-6 overflow-hidden bg-[#f3f3f3] rounded-[2.5rem] transition-all duration-500 hover:shadow-xl">
                    
                    <img 
                      src={displayImage} // ✅ Uses correct image
                      alt={product.name} 
                      className="w-full h-full object-cover mix-blend-multiply p-4 transition-transform duration-700 group-hover:scale-110"
                      onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&q=80&w=500"; }}
                    />

                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-500 flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <div className="bg-white text-black p-4 rounded-full shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all">
                          <ShoppingCart size={20} />
                        </div>
                    </div>
                  </div>

                  <div className="text-center space-y-1 w-full">
                    <h3 className="text-sm font-bold text-slate-800 uppercase tracking-tight truncate px-2">{product.name}</h3>
                    <div className="flex justify-center items-center gap-3">
                      {/* ✅ Uses Calculated Prices */}
                      <span className="text-orange-600 font-black">₹{sp}</span>
                      {mrp > sp && (
                        <span className="text-slate-400 text-xs line-through">₹{mrp}</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AnantamCollection;