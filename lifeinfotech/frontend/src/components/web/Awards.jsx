import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Awards = () => {
  // --- 1. PRODUCT DATA WITH AWARD BADGES ---
  const awardProducts = [
    {
      id: 1,
      image: "/awards/awards0.jpg", // Hair Revival Serum
      badge: "/awards/awards1.jpg", // Cosmopolitan Winner 2019
      alt: "Cosmopolitan Beauty Awards 2019 Winner"
    },
    {
      id: 2,
      image: "/awards/awards2.jpg", // Gulab Arka
      badge: "/awards/awards3.jpg", // Cosmopolitan Winner 2019
      alt: "Cosmopolitan Beauty Awards 2019 Winner"
    },
    {
      id: 3,
      image: "/awards/awards4.jpg", // Gold and Saffron Gel
      badge: "/awards/awards5.jpg", // Harper's Bazaar Conscious Beauty
      alt: "Harper's Bazaar Conscious Beauty Awards"
    },
    {
      id: 4,
      image: "/awards/awards6.jpg", // Nourishing Hair Oil
      badge: "/awards/awards7.jpg", // Harper's Bazaar Conscious Beauty
      alt: "Harper's Bazaar Conscious Beauty Awards"
    },
    {
      id: 5,
      image: "/awards/awards2.jpg", // Extra Product for sliding
      badge: "/awards/awards0.jpg",
      alt: "Beauty Award"
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsToShow = 4; // Desktop pe 4 products dikhenge
  const maxIndex = awardProducts.length - itemsToShow;

  // --- 2. MANUAL CLICK LOGIC (< >) ---
  const nextSlide = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
  };

  return (
    <div className="py-16 bg-[#FEF9F1]"> {/* Light cream background as per screenshot */}
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-12 uppercase tracking-widest text-black">
          Awards & Accolades
        </h2>

        <div className="relative group max-w-7xl mx-auto px-10 md:px-16">
          
          {/* LEFT BUTTON (<) */}
          <button 
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 p-2 md:p-3 rounded-full bg-white border border-gray-200 text-gray-400 hover:bg-black hover:text-white transition-all shadow-sm"
          >
            <ChevronLeft size={24} />
          </button>

          {/* SLIDER TRACK */}
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * (100 / itemsToShow)}%)` }}
            >
              {awardProducts.map((item) => (
                <div 
                  key={item.id} 
                  className="flex-shrink-0 px-4" 
                  style={{ width: `${100 / itemsToShow}%` }}
                >
                  {/* CARD DESIGN: Added white bg and shadow for clear visibility */}
                  <div className="relative bg-white rounded-2xl p-6 h-[400px] flex items-center justify-center shadow-sm hover:shadow-md transition-shadow border border-gray-50">
                    
                    {/* Product Image */}
                    <img 
                      src={item.image} 
                      alt="Awarded Product" 
                      className="max-h-full w-auto object-contain"
                    />

                    {/* Award Badge Overlay (Top Right) */}
                    <div className="absolute top-10 right-4 w-24 md:w-32">
                      <img 
                        src={item.badge} 
                        alt={item.alt} 
                        className="w-full h-auto drop-shadow-md"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT BUTTON (>) */}
          <button 
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 p-2 md:p-3 rounded-full bg-white border border-gray-200 text-gray-400 hover:bg-black hover:text-white transition-all shadow-sm"
          >
            <ChevronRight size={24} />
          </button>

        </div>
      </div>
    </div>
  );
};

export default Awards;