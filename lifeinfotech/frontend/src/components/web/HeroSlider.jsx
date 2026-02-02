import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ChevronLeft, ChevronRight, Truck, ShieldCheck, Stethoscope } from 'lucide-react';

const HeroSlider = () => {
  const [slides, setSlides] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);

  // Backend API Base URL
  const API_BASE = "https://labrostone-backend.onrender.com";

  useEffect(() => {
    const fetchSliders = async () => {
      try {
        // Live Backend se data fetch karna
        const response = await axios.get(`${API_BASE}/api/admin/sliders`);
        
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

  if (loading) return <div className="h-[350px] md:h-[500px] flex items-center justify-center bg-gray-100 font-bold">Loading Lebrostone Banners...</div>;
  if (slides.length === 0) return null;

  const slide = slides[currentSlide];

  return (
    <div className="relative w-full group">
      <div className="relative w-full overflow-hidden">
        {/* --- DYNAMIC IMAGE --- */}
        <img 
          key={slide._id} 
          // Database se aane wala full URL use karna
          src={slide.image} 
          alt={slide.title || "Lebrostone Banner"} 
          className="w-full h-[350px] md:h-[500px] object-cover object-top block animate-wait-zoom"
          onError={(e) => { e.target.src = 'https://via.placeholder.com/1200x500?text=Banner+Image+Not+Found'; }}
        />

        {/* Content Overlay */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="container mx-auto px-6 flex flex-col items-start justify-center h-full">
            <div className="md:w-1/2 text-left space-y-4 md:space-y-6 pl-0 md:pl-12 pt-8 md:pt-0 pointer-events-auto">
              {slide.title && (
                <h2 className="text-2xl md:text-5xl font-bold whitespace-pre-line text-white drop-shadow-2xl bg-black/30 p-4 rounded-lg backdrop-blur-sm">
                  {slide.title}
                </h2>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button onClick={prevSlide} className="absolute left-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/20 hover:bg-white/50 transition-all z-20 backdrop-blur-md opacity-0 group-hover:opacity-100">
        <ChevronLeft size={28} className="text-white" />
      </button>
      <button onClick={nextSlide} className="absolute right-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/20 hover:bg-white/50 transition-all z-20 backdrop-blur-md opacity-0 group-hover:opacity-100">
        <ChevronRight size={28} className="text-white" />
      </button>

      {/* Features Bar */}
      <div className="bg-[#Fdfbf7] py-6 border-t border-gray-100 shadow-sm">
        <div className="container mx-auto flex flex-wrap justify-center gap-6 md:gap-16 text-gray-700 text-xs md:text-sm font-bold px-4">
          <div className="flex items-center gap-3"><Truck size={20} className="text-emerald-600" /> FREE SHIPPING</div>
          <div className="flex items-center gap-3"><ShieldCheck size={20} className="text-emerald-600" /> SECURE CHECKOUT</div>
          <div className="flex items-center gap-3"><Stethoscope size={20} className="text-emerald-600" /> DOCTOR CONSULTATION</div>
        </div>
      </div>

      <style>{`
        @keyframes waitAndZoomOut {
          0%   { transform: scale(1.1); }
          80%  { transform: scale(1.1); }
          100% { transform: scale(1.0); }
        }
        .animate-wait-zoom {
          animation: waitAndZoomOut 5s ease-in-out infinite alternate; 
        }
      `}</style>
    </div>
  );
};

export default HeroSlider;