import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ShoppingCart, Star, RefreshCw, Package } from 'lucide-react';

const AnantamCollection = () => {
  const [products, setProducts] = useState([]);
  // Blinking rokne ke liye LocalStorage se initial value uthayein
  const [bannerUrl, setBannerUrl] = useState(localStorage.getItem('cached_anantam_banner') || ""); 
  const [loading, setLoading] = useState(true);
  const API_BASE = "http://localhost:5000";

  useEffect(() => {
    const fetchAnantamData = async () => {
      try {
        // Backend se fresh data fetch karein
        const [bannerRes, productRes] = await Promise.all([
          axios.get(`${API_BASE}/api/products/banner`),
          axios.get(`${API_BASE}/api/products/anantam-collection`)
        ]);

        if (bannerRes.data.success) {
          const freshBanner = `${bannerRes.data.url}?t=${Date.now()}`;
          setBannerUrl(freshBanner);
          // Naya banner memory mein save karein
          localStorage.setItem('cached_anantam_banner', freshBanner);
        }

        if (productRes.data.success) {
          setProducts(productRes.data.data);
        }
      } catch (err) {
        console.error("Server connection lost. Using cached data.");
        // Error aane par hum bannerUrl ko khali nahi karenge (No Blink!)
      } finally {
        setLoading(false);
      }
    };
    fetchAnantamData();
  }, []);

  // Sirf pehli baar load hote waqt bada loader dikhayenge
  if (loading && !bannerUrl) return (
    <div className="flex flex-col items-center justify-center py-40 bg-white">
      <RefreshCw className="animate-spin text-orange-400 mb-4" size={40} />
      <div className="italic font-black text-slate-300 animate-pulse uppercase tracking-widest text-center px-4">
        PREPARING THE ANANTAM EXPERIENCE...
      </div>
    </div>
  );

  return (
    <div className="py-12 bg-white selection:bg-orange-100">
      
      {/* 1. PREMIUM DYNAMIC BANNER SECTION */}
      <div className="relative w-full h-[400px] md:h-[500px] bg-[#2d1b10] flex items-center justify-center overflow-hidden mb-16 rounded-[2.5rem] md:rounded-[4rem] container mx-auto shadow-2xl transition-all duration-700">
        
        {/* Layered Background */}
        <div className="absolute inset-0 bg-gradient-to-tr from-[#1a0f09] via-[#2d1b10] to-[#4a3021] opacity-100"></div>
        <div className="absolute inset-0 opacity-30 mix-blend-overlay pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-orange-300 blur-[150px] rounded-full"></div>
          <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-emerald-300 blur-[130px] rounded-full opacity-20"></div>
        </div>

        <div className="container mx-auto px-6 md:px-20 flex flex-col md:flex-row items-center justify-between relative z-10 h-full gap-8">
          
          {/* TEXT CONTENT */}
          <div className="text-center md:text-left text-white md:w-1/2 space-y-6 pt-10 md:pt-0">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 mb-2">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-orange-200">Exclusive Collection</span>
            </div>
            <h2 className="text-4xl md:text-7xl font-serif leading-[1.05] italic tracking-tight">
              Crafted for <span className="text-orange-200">indulgence,</span><br />
              Elevated for <span className="underline decoration-orange-300/20 underline-offset-[12px]">timeless care.</span>
            </h2>
            <p className="text-sm md:text-lg text-white/60 font-medium max-w-sm italic leading-relaxed">
              Experience the soul of Ayurveda with our most premium selection, curated specifically for you.
            </p>
          </div>

          {/* DYNAMIC IMAGE: Floating & pop-out effect */}
          <div className="md:w-1/2 h-full flex justify-center md:justify-end relative py-8 md:py-12">
            <div className="absolute inset-0 bg-orange-500/10 blur-[100px] rounded-full scale-125 animate-pulse"></div>
            
            <img 
              src={bannerUrl || "/banar/banner1.jpg"} 
              alt="Anantam Banner" 
              className="
                h-full w-auto
                max-h-[250px] md:max-h-[420px]
                object-contain 
                rounded-[3rem] 
                shadow-[0_20px_50px_rgba(0,0,0,0.5)]
                border-2 border-white/10 
                hover:scale-[1.03] 
                transition-all duration-1000 ease-in-out z-20"
              onError={(e) => { e.target.src = "/banar/banner1.jpg"; }} 
            />
          </div>
        </div>

        {/* Bottom Decorative Line */}
        <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-orange-400/30 to-transparent"></div>
      </div>

      {/* 2. PRODUCT GRID SECTION */}
      <div className="container mx-auto px-4 md:px-12">
        <div className="flex flex-col items-center mb-16">
           <h2 className="text-3xl font-black uppercase tracking-[0.4em] text-slate-900 italic">The Series</h2>
           <div className="h-1.5 w-24 bg-orange-500 mt-4 rounded-full"></div>
        </div>

        {products.length === 0 && !loading ? (
          <div className="flex flex-col items-center justify-center py-32 border-4 border-dashed border-slate-50 rounded-[4rem]">
            <Package size={48} className="text-slate-200 mb-4" />
            <p className="text-slate-400 font-bold uppercase tracking-[0.2em] italic">The curation is in progress...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
            {products.map((product) => (
              <div key={product._id} className="group/item flex flex-col transform hover:-translate-y-2 transition-all duration-500">
                <div className="relative w-full aspect-[4/5] mb-6 overflow-hidden bg-slate-50 rounded-[3rem] shadow-sm hover:shadow-2xl transition-all duration-500 group-hover/item:bg-white border border-transparent hover:border-slate-100">
                  
                  {/* Status Badge */}
                  <div className="absolute top-8 left-8 bg-black/90 backdrop-blur-md text-white text-[9px] font-black px-4 py-2 rounded-full z-10 uppercase tracking-widest shadow-xl">
                    {product.is_combo ? 'COMBO OFFER' : 'PREMIUM'}
                  </div>

                  <img 
                    src={product.images?.[0] || "/default-product.png"} 
                    alt={product.name} 
                    className="absolute inset-0 w-full h-full object-contain p-12 transition-transform duration-[1.5s] group-hover/item:scale-110"
                  />

                  {/* Cart Action */}
                  <div className="absolute bottom-8 right-8 translate-y-6 opacity-0 group-hover/item:translate-y-0 group-hover/item:opacity-100 transition-all duration-500 z-20">
                    <button className="bg-black text-white p-5 rounded-full shadow-2xl hover:bg-orange-600 transition-all active:scale-90">
                      <ShoppingCart size={22} />
                    </button>
                  </div>
                </div>

                <div className="px-4 space-y-2">
                  <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight line-clamp-2 min-h-[40px]">
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-4">
                    <span className="font-black text-orange-600 text-xl italic">
                      ₹{product.variants?.[0]?.selling_price || "0"}
                    </span>
                    <span className="text-slate-300 line-through text-xs font-bold">
                      ₹{product.variants?.[0]?.mrp || "0"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AnantamCollection;