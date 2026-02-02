import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Star, ChevronLeft, ChevronRight, ShoppingCart, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TopPicks = () => {
  const [activeTab, setActiveTab] = useState('bestsellers');
  const [products, setProducts] = useState({
    bestsellers: [],
    newArrival: [],
    combos: []
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // const API_BASE = "http://localhost:5000";
  const API_BASE = "https://labrostone-backend.onrender.com";

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_BASE}/api/products`);
        const allData = res.data.data;

        // --- DYNAMIC FILTERING LOGIC ---
        const filtered = {
          // 1. Bestsellers: Jinka is_bestseller true hai
          bestsellers: allData.filter(p => p.is_bestseller).slice(0, 4),
          
          // 2. New Arrival: Jo sabse latest add hue hain
          newArrival: [...allData].sort((a, b) => 
            new Date(b.createdAt) - new Date(a.createdAt)
          ).slice(0, 4),
          
          // 3. Combos: Jinka is_combo true hai
          combos: allData.filter(p => p.is_combo).slice(0, 4)
        };

        setProducts(filtered);
        setLoading(false);
      } catch (err) {
        console.error("Error loading top picks:", err);
        setLoading(false);
      }
    };
    fetchAllData();
  }, []);

  if (loading) return (
    <div className="flex justify-center py-20">
      <Loader2 className="animate-spin text-slate-400" size={40} />
    </div>
  );

  return (
    <div className="py-16 bg-white">
      <div className="container mx-auto px-4">
        
        <h2 className="text-3xl font-bold text-center mb-8 text-black tracking-wide uppercase">
          Top Picks This Season
        </h2>

        {/* TABS BUTTONS */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex bg-[#D4CBB8] p-1 rounded-full">
            {[
              { id: 'bestsellers', label: 'Bestsellers' },
              { id: 'newArrival', label: 'New Arrival' },
              { id: 'combos', label: 'Combos' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-8 py-2 rounded-full text-sm font-semibold transition-all duration-300 uppercase tracking-wider ${
                  activeTab === tab.id
                    ? 'bg-white text-black shadow-md' 
                    : 'text-gray-700 hover:text-black'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* PRODUCTS GRID */}
        <div className="relative px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {products[activeTab].map((product) => {
              const sellingPrice = product.variants?.[0]?.selling_price || 0;
              const mrp = product.variants?.[0]?.mrp || 0;
              const discount = mrp > 0 ? Math.round(((mrp - sellingPrice) / mrp) * 100) : 0;

              return (
                <div 
                  key={product._id} 
                  className="group flex flex-col items-center text-center cursor-pointer"
                  onClick={() => navigate(`/product/${product._id}`)}
                >
                  
                  {/* --- IMAGE CONTAINER --- */}
                  <div className="relative w-full mb-4 overflow-hidden aspect-square bg-slate-50">
                    {/* Dynamic Discount Badge */}
                    {discount > 0 && (
                      <div className="absolute top-0 left-0 bg-black text-white text-[10px] font-bold px-2 py-1 uppercase z-10">
                        {discount}% OFF
                      </div>
                    )}

                    {/* 1. Main Image (Dynamic) */}
                    <img 
                      src={product.images?.[0] || "https://via.placeholder.com/300"} 
                      alt={product.name} 
                      className="absolute inset-0 w-full h-full object-contain transition-opacity duration-500 opacity-100 group-hover:opacity-0 p-4"
                    />

                    {/* 2. Hover Image (Dynamic - uses second image if available) */}
                    <img 
                      src={product.images?.[1] || product.images?.[0]} 
                      alt={product.name} 
                      className="absolute inset-0 w-full h-full object-contain transition-opacity duration-500 opacity-0 group-hover:opacity-100 p-4"
                    />

                    <div className="absolute bottom-4 right-4 bg-white p-2 rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                      <ShoppingCart size={18} />
                    </div>
                  </div>

                  {/* Product Info */}
                  <h3 className="text-sm font-medium text-gray-800 mb-2 min-h-[40px] line-clamp-2 px-2 uppercase">
                    {product.name}
                  </h3>

                  <div className="flex items-center gap-2 mb-2 text-sm">
                    <span className="text-gray-400 line-through text-xs">₹ {mrp}</span>
                    <span className="font-bold text-gray-900">₹ {sellingPrice}</span>
                  </div>

                  {/* Ratings */}
                  <div className="flex items-center gap-1 mb-4">
                    <div className="flex text-yellow-500">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          size={12} 
                          fill={i < Math.round(product.rating || 0) ? "currentColor" : "none"} 
                          className={i < Math.round(product.rating || 0) ? "text-yellow-500" : "text-gray-300"}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-500 ml-1">({product.reviews_count || 0})</span>
                  </div>

                  {/* Button */}
                  <button className="w-full border border-black py-3 text-xs font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-colors">
                    {product.variants?.length > 1 ? "CHOOSE OPTION" : "ADD TO CART"}
                  </button>

                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};

export default TopPicks;