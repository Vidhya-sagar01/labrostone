import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Flower, Sprout, Hexagon, Sun, Infinity, Heart, Sparkles, Gift } from 'lucide-react';

const ShopByConcern = () => {
  // 1. Data
  const categories = [
    { id: 1, name: "Body Care", icon: <Flower size={20} />, image: "/category/category0.jpg" },
    { id: 2, name: "Hair Care", icon: <Sprout size={20} />, image: "/category/category1.jpg" },
    { id: 3, name: "Men's Care", icon: <Hexagon size={20} />, image: "/category/category2.jpg" },
    { id: 4, name: "Spa Range", icon: <Sun size={20} />, image: "/category/category3.jpg" },
    { id: 5, name: "Anantam", icon: <Infinity size={20} />, image: "/category/category4.jpg" },
    { id: 6, name: "Face Care", icon: <Heart size={20} />, image: "/category/category5.jpg" },
    { id: 7, name: "New Arrivals", icon: <Sparkles size={20} />, image: "/category/category6.png" },
    { id: 8, name: "Gift Sets", icon: <Gift size={20} />, image: "/category/category7.png" },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsToShow, setItemsToShow] = useState(6); // Default 6 kar diya

  // --- RESPONSIVE LOGIC ---
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setItemsToShow(2); // Mobile par 2
      } else if (window.innerWidth < 1024) {
        setItemsToShow(3); // Tablet par 3
      } else {
        setItemsToShow(6); // CHANGE: Desktop par ab 6 dikhenge (pehle 5 tha)
      }
    };

    handleResize(); 
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  // -------------------------

  const maxIndex = categories.length - itemsToShow; 

  // Next Slide
  const nextSlide = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  // Previous Slide
  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
  };

  // Auto-Play (3 Seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 3000);
    return () => clearInterval(interval);
  }, [currentIndex, maxIndex]); 

  return (
    <div className="py-12 bg-white">
      <div className="container mx-auto px-4">
        
        {/* Heading */}
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-black uppercase tracking-wide">
          Shop By Concern
        </h2>

        {/* Slider Container */}
        <div className="relative group px-4 md:px-12">
          
          {/* Left Arrow */}
          <button 
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 md:w-10 md:h-10 bg-white border border-gray-300 rounded-full flex items-center justify-center text-gray-600 hover:bg-black hover:text-white transition-colors shadow-lg"
          >
            <ChevronLeft size={20} className="md:w-6 md:h-6" />
          </button>

          {/* Slider Window */}
          <div className="overflow-hidden w-full">
            <div 
              className="flex transition-transform duration-700 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * (100 / itemsToShow)}%)` }}
            >
              {categories.map((cat) => (
                <div 
                  key={cat.id} 
                  className="flex-shrink-0 px-2"
                  style={{ width: `${100 / itemsToShow}%` }} // Dynamic Width (ab 16.66% hogi desktop par)
                >
                  <div className="relative w-full aspect-square rounded-xl overflow-hidden cursor-pointer group/card border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    {/* Image */}
                    <img 
                      src={cat.image} 
                      alt={cat.name} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-110"
                    />
                    
                    {/* Gradient Overlay */}
                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent"></div>

                    {/* Text & Icon */}
                    <div className="absolute bottom-3 right-3 text-right text-white">
                      <div className="flex justify-end mb-1">
                        {cat.icon}
                      </div>
                      <p className="text-xs md:text-sm font-medium tracking-wide">{cat.name}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Arrow */}
          <button 
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 md:w-10 md:h-10 bg-white border border-gray-300 rounded-full flex items-center justify-center text-gray-600 hover:bg-black hover:text-white transition-colors shadow-lg"
          >
            <ChevronRight size={20} className="md:w-6 md:h-6" />
          </button>

        </div>
      </div>
    </div>
  );
};

export default ShopByConcern;