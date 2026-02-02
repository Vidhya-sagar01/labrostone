import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ChevronLeft, ChevronRight, Truck, ShieldCheck, Stethoscope } from 'lucide-react';

const HeroSlider = () => {
  const [slides, setSlides] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSliders = async () => {
      try {
        // ✅ 1. Correct URL: Aapke server.js ke mutabik path '/api/admin/sliders' hai
        // const response = await axios.get('http://localhost:5000/api/admin/sliders');
        const response = await axios.get('https://labrostone-backend.onrender.com/api/admin/sliders');
        // ✅ 2. Correct Data Access: Backend 'sliders' key mein array bhej raha hai
        if (response.data.success && Array.isArray(response.data.sliders)) {
          setSlides(response.data.sliders);
        }
      } catch (error) {
        console.error("Error fetching sliders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSliders();
  }, []);

  const nextSlide = () => {
    if (slides.length === 0) return;
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    if (slides.length === 0) return;
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  useEffect(() => {
    if (slides.length === 0) return;
    const interval = setInterval(nextSlide, 4000);
    return () => clearInterval(interval);
  }, [currentSlide, slides.length]);

  if (loading) return <div className="h-[350px] md:h-[500px] flex items-center justify-center bg-gray-100">Loading Sliders...</div>;
  if (slides.length === 0) return null;

  const slide = slides[currentSlide];

  return (
    <div className="relative w-full group">
      <div className="relative w-full overflow-hidden">
        {/* --- DYNAMIC IMAGE --- */}
        <img 
          key={slide._id} 
          src={slide.image} 
          alt={slide.title || "Lebrostone Banner"} 
          className="w-full h-[350px] md:h-[500px] object-cover object-top block animate-wait-zoom"
        />

        {/* Content Overlay */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="container mx-auto px-6 flex flex-col items-start justify-center h-full">
            <div className="md:w-1/2 text-left space-y-4 md:space-y-6 pl-0 md:pl-12 pt-8 md:pt-0 pointer-events-auto">
              {slide.title && (
                <h2 className="text-2xl md:text-5xl font-bold whitespace-pre-line text-white drop-shadow-xl bg-black/20 p-2 rounded">
                  {slide.title}
                </h2>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button onClick={prevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/30 hover:bg-white transition z-20 backdrop-blur-sm opacity-0 group-hover:opacity-100">
        <ChevronLeft size={24} className="text-gray-800" />
      </button>
      <button onClick={nextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/30 hover:bg-white transition z-20 backdrop-blur-sm opacity-0 group-hover:opacity-100">
        <ChevronRight size={24} className="text-gray-800" />
      </button>

      {/* Features Bar */}
      <div className="bg-[#Fdfbf7] py-4 border-t border-gray-200">
        <div className="container mx-auto flex flex-wrap justify-center gap-4 md:gap-12 text-gray-700 text-xs md:text-sm font-semibold px-4">
          <div className="flex items-center gap-2"><Truck size={18} className="text-red-600" /> Free Shipping</div>
          <div className="flex items-center gap-2"><ShieldCheck size={18} className="text-red-600" /> Secure Checkout</div>
          <div className="flex items-center gap-2"><Stethoscope size={18} className="text-red-600" /> Free Doctor Consultation</div>
        </div>
      </div>

      <style>{`
        @keyframes waitAndZoomOut {
          0%   { transform: scale(1.15); }
          75%  { transform: scale(1.15); }
          100% { transform: scale(1.0); }
        }
        .animate-wait-zoom {
          animation: waitAndZoomOut 4s ease-in-out forwards; 
        }
      `}</style>
    </div>
  );
};

export default HeroSlider;