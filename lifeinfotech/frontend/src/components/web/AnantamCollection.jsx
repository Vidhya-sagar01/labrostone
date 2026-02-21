import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ShoppingCart } from 'lucide-react';

const AnantamCollection = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

  // Fetch active banners
  const fetchBanners = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/anantam/banners');
      setBanners(response.data.data);
    } catch (error) {
      console.error('Error fetching banners:', error);
    }
  };

  // Fetch Anantam products
  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/anantam/collection');
      setProducts(response.data.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  useEffect(() => {
    Promise.all([fetchBanners(), fetchProducts()]).finally(() => {
      setLoading(false);
    });
  }, []);

  // Auto-rotate banners
  useEffect(() => {
    if (banners.length > 1) {
      const interval = setInterval(() => {
        setCurrentBannerIndex((prev) => (prev + 1) % banners.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [banners.length]);

  const currentBanner = banners[currentBannerIndex];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F97316]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* 1. PREMIUM BANNER SECTION */}
      {banners.length > 0 && (
        <div className="px-4 md:px-10 py-6">
          <div className="relative h-[450px] md:h-[500px] w-full bg-[#0C0A09] rounded-[40px] md:rounded-[60px] overflow-hidden shadow-2xl flex items-center">
            {/* Background Image (If available) or solid color */}
            {currentBanner.imageUrl && (
              <img 
                src={currentBanner.imageUrl} 
                className="absolute inset-0 w-full h-full object-cover opacity-40" 
                alt="banner bg" 
              />
            )}
            
            <div className="relative z-10 px-8 md:px-20 max-w-3xl">
              {/* Series Badge */}
              <div className="inline-block px-4 py-1.5 rounded-full border border-[#78350F] bg-[#451A03]/30 mb-6">
                <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-[#D97706]">
                  {currentBanner.seriesName}
                </span>
              </div>
              
              {/* Heading: Using Serif for "Elevated" feel */}
              <h1 className="text-5xl md:text-7xl font-serif text-white leading-[1.1] mb-6 tracking-tight">
                {currentBanner.title.split(' ').map((word, i) => (
                  <span key={i} className={i === 1 ? "text-[#FF9F66] italic" : ""}>
                    {word}{' '}
                  </span>
                ))}
              </h1>
              
              <p className="text-gray-400 text-base md:text-lg mb-10 max-w-md leading-relaxed">
                {currentBanner.subtitle || currentBanner.description}
              </p>
              
              <button className="bg-[#F97316] hover:bg-[#EA580C] text-white font-black py-4 px-10 rounded-2xl text-xs uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-lg shadow-orange-900/20">
                {currentBanner.ctaText}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. COLLECTION SECTION */}
      <div className="py-20 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-2xl md:text-3xl font-black text-[#1E293B] tracking-[0.1em] uppercase">
            The Collection
          </h2>
          <div className="w-12 h-1 bg-[#F97316] mx-auto mt-4 rounded-full"></div>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-20 text-gray-400 font-bold uppercase tracking-widest">
            Coming Soon...
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-16">
            {products.map((product) => (
              <div 
                key={product._id} 
                className="group cursor-pointer"
                onClick={() => {
                  // Open product details page
                  window.location.href = `/product/${product._id}`;
                }}
              >
                {/* Product Image Card */}
                <div className="relative aspect-[4/5] bg-[#F1F5F9] rounded-[40px] md:rounded-[50px] overflow-hidden mb-6 transition-transform duration-500 group-hover:-translate-y-2 group-hover:shadow-2xl group-hover:shadow-gray-200">
                  {product.thumbnail ? (
                    <img
                      src={`http://localhost:5001${product.thumbnail}`}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300 italic font-serif">
                      {product.name}
                    </div>
                  )}
                          
                  {/* Hover Cart Overlay */}
                  <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-xl transform scale-50 group-hover:scale-100 transition-transform duration-300">
                      <ShoppingCart className="text-[#1E293B]" size={20} />
                    </div>
                  </div>

                  {/* Tag Badge */}
                  {product.productTag && product.productTag !== 'Simple' && (
                    <div className="absolute top-6 left-6">
                      <span className="px-4 py-1.5 bg-white/90 backdrop-blur-md rounded-full text-[9px] font-black uppercase tracking-widest text-[#1E293B] shadow-sm">
                        {product.productTag}
                      </span>
                    </div>
                  )}
                </div>

                {/* Product Text Details */}
                <div className="text-center px-4">
                  <h3 className="text-sm font-black text-[#64748B] uppercase tracking-widest mb-2 group-hover:text-[#F97316] transition-colors">
                    {product.name}
                  </h3>
                  
                  <div className="flex items-center justify-center gap-3">
                    <span className="text-xl font-black text-[#F97316]">
                      ₹{product.unitPrice}
                    </span>
                    {product.discountAmount > 0 && (
                      <span className="text-sm text-gray-400 line-through font-bold">
                        ₹{product.unitPrice + product.discountAmount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer Decoration (Subtle light gray gradient at bottom) */}
      <div className="h-40 bg-gradient-to-t from-[#F8FAFC] to-transparent"></div>
    </div>
  );
};

export default AnantamCollection;