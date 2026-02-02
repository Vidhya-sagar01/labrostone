import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Flower, Sprout, Hexagon, Sun, Infinity, Heart, Sparkles, Gift } from 'lucide-react';

const ShopByConcern = () => {
  // ✅ 1. Data with LIVE IMAGE LINKS (Unsplash)
  // Yeh images live hain aur server par load hongi.
  const categories = [
    { id: 1, name: "Body Care", icon: <Flower size={20} />, image: "https://images.unsplash.com/photo-1552693673-1bf958298935?q=80&w=500&auto=format&fit=crop" },
    { id: 2, name: "Hair Care", icon: <Sprout size={20} />, image: "https://images.unsplash.com/photo-1527799822344-429dfa621db3?q=80&w=500&auto=format&fit=crop" },
    { id: 3, name: "Men's Care", icon: <Hexagon size={20} />, image: "https://images.unsplash.com/photo-1626285861696-9f0bf5a49c6d?q=80&w=500&auto=format&fit=crop" },
    { id: 4, name: "Spa Range", icon: <Sun size={20} />, image: "https://images.unsplash.com/photo-1544161515-4af6b1d4640b?q=80&w=500&auto=format&fit=crop" },
    { id: 5, name: "Anantam", icon: <Infinity size={20} />, image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=500&auto=format&fit=crop" },
    { id: 6, name: "Face Care", icon: <Heart size={20} />, image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=500&auto=format&fit=crop" },
    { id: 7, name: "New Arrivals", icon: <Sparkles size={20} />, image: "https://images.unsplash.com/photo-1612817288484-6f916006741a?q=80&w=500&auto=format&fit=crop" },
    { id: 8, name: "Gift Sets", icon: <Gift size={20} />, image: "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?q=80&w=500&auto=format&fit=crop" },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsToShow, setItemsToShow] = useState(6);

  // --- RESPONSIVE LOGIC ---
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) setItemsToShow(2);
      else if (window.innerWidth < 1024) setItemsToShow(3);
      else setItemsToShow(6);
    };
    handleResize(); 
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const maxIndex = categories.length - itemsToShow; 

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
  };

  // Auto-Play
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 4000);
    return () => clearInterval(interval);
  }, [currentIndex, maxIndex]); 

  return (
    <div className="py-16 bg-[#FDFBF7]">
      <div className="container mx-auto px-4">
        
        <h2 className="text-3xl font-black text-center mb-12 text-slate-900 uppercase italic tracking-tighter">
          Shop By <span className="text-[#A88B56]">Concern</span>
        </h2>

        <div className="relative group px-2 md:px-10">
          
          {/* Arrows */}
          <button onClick={prevSlide} className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white shadow-xl rounded-full flex items-center justify-center text-slate-400 hover:text-black transition-all border border-slate-100">
            <ChevronLeft size={24} />
          </button>

          <div className="overflow-hidden rounded-[2rem]">
            <div 
              className="flex transition-transform duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)]"
              style={{ transform: `translateX(-${currentIndex * (100 / itemsToShow)}%)` }}
            >
              {categories.map((cat) => (
                <div 
                  key={cat.id} 
                  className="flex-shrink-0 px-3"
                  style={{ width: `${100 / itemsToShow}%` }}
                >
                  <div className="relative w-full aspect-[4/5] rounded-[2.5rem] overflow-hidden cursor-pointer group/card shadow-sm hover:shadow-2xl transition-all duration-500 border border-transparent hover:border-[#A88B56]/20">
                    
                    {/* ✅ Live Image Tag */}
                    <img 
                      src={cat.image} 
                      alt={cat.name} 
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover/card:scale-110"
                      onError={(e) => { e.target.src = "https://via.placeholder.com/400x500?text=Lebrostone"; }}
                    />
                    
                    {/* Glassy Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover/card:opacity-100 transition-opacity"></div>

                    {/* Content */}
                    <div className="absolute bottom-6 left-0 right-0 px-5 text-center text-white">
                      <div className="flex justify-center mb-3 transform group-hover/card:-translate-y-1 transition-transform">
                        <div className="p-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-white">
                          {cat.icon}
                        </div>
                      </div>
                      <p className="text-xs font-black uppercase tracking-[0.2em] italic">{cat.name}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button onClick={nextSlide} className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white shadow-xl rounded-full flex items-center justify-center text-slate-400 hover:text-black transition-all border border-slate-100">
            <ChevronRight size={24} />
          </button>

        </div>
      </div>
    </div>
  );
};

export default ShopByConcern;