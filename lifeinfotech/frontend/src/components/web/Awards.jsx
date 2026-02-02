import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Awards = () => {
  // ✅ Verified HTTPS Live Images (Premium Wellness & Award Badges)
  const awardProducts = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=600&auto=format&fit=crop", 
      badge: "https://cdn-icons-png.flaticon.com/512/5219/5219258.png", // Gold Award Badge
      alt: "Cosmopolitan Beauty Awards Winner"
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=600&auto=format&fit=crop", 
      badge: "https://cdn-icons-png.flaticon.com/512/1904/1904425.png", // Premium Badge
      alt: "Vogue Beauty Awards Winner"
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=600&auto=format&fit=crop", 
      badge: "https://cdn-icons-png.flaticon.com/512/3112/3112946.png", // Quality Badge
      alt: "Harper's Bazaar Conscious Beauty"
    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?q=80&w=600&auto=format&fit=crop", 
      badge: "https://cdn-icons-png.flaticon.com/512/2143/2143150.png", // Natural Badge
      alt: "Global Green Beauty Awards"
    },
    {
      id: 5,
      image: "https://images.unsplash.com/photo-1527799822344-429dfa621db3?q=80&w=600&auto=format&fit=crop", 
      badge: "https://cdn-icons-png.flaticon.com/512/5219/5219258.png",
      alt: "Excellence in Ayurveda"
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsToShow = 4; 
  const maxIndex = awardProducts.length - itemsToShow;

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
  };

  return (
    <div className="py-20 bg-[#FDFBF7]"> 
      <div className="container mx-auto px-4">
        
        {/* HEADING */}
        <div className="flex flex-col items-center mb-16 text-center">
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 uppercase italic tracking-tighter">
            Awards & <span className="text-[#A88B56]">Accolades</span>
          </h2>
          <div className="h-1.5 w-24 bg-[#A88B56] mt-4 rounded-full"></div>
        </div>

        <div className="relative group max-w-7xl mx-auto px-10 md:px-16">
          
          {/* NAVIGATION BUTTONS */}
          <button 
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white shadow-xl rounded-full flex items-center justify-center text-slate-400 hover:text-black transition-all border border-slate-100"
          >
            <ChevronLeft size={28} />
          </button>

          <div className="overflow-hidden rounded-[3rem]">
            <div 
              className="flex transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]"
              style={{ transform: `translateX(-${currentIndex * (100 / itemsToShow)}%)` }}
            >
              {awardProducts.map((item) => (
                <div 
                  key={item.id} 
                  className="flex-shrink-0 px-4" 
                  style={{ width: `${100 / itemsToShow}%` }}
                >
                  <div className="relative bg-white rounded-[2.5rem] p-8 h-[450px] flex flex-col items-center justify-center shadow-sm hover:shadow-2xl transition-all duration-500 border border-slate-100 group/card">
                    
                    {/* ✅ LIVE HTTPS PRODUCT IMAGE */}
                    <img 
                      src={item.image} 
                      alt="Awarded Product" 
                      className="max-h-[70%] w-auto object-contain transition-transform duration-700 group-hover/card:scale-110"
                      onError={(e) => { e.target.src = "https://via.placeholder.com/400x600?text=Lebrostone+Award"; }}
                    />

                    {/* ✅ LIVE HTTPS AWARD BADGE */}
                    <div className="absolute top-10 right-6 w-20 md:w-24 transform group-hover/card:rotate-12 transition-transform duration-500">
                      <img 
                        src={item.badge} 
                        alt={item.alt} 
                        className="w-full h-auto drop-shadow-lg"
                      />
                    </div>

                    <div className="mt-6 text-center">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#A88B56]">{item.alt}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button 
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white shadow-xl rounded-full flex items-center justify-center text-slate-400 hover:text-black transition-all border border-slate-100"
          >
            <ChevronRight size={28} />
          </button>

        </div>
      </div>
    </div>
  );
};

export default Awards;