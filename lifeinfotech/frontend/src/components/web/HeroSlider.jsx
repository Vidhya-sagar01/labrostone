import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ChevronLeft, ChevronRight, Truck, ShieldCheck, Stethoscope } from 'lucide-react';

const HeroSlider = () => {
  const [slides, setSlides] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);

  // ✅ Backend URL constant
  const API_BASE = "https://labrostone-backend.onrender.com";

  useEffect(() => {
    const fetchSliders = async () => {
      try {
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
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [currentSlide, slides.length]);

  if (loading) return <div className="h-[350px] md:h-[500px] flex items-center justify-center bg-gray-100 font-bold">Loading...</div>;
  if (slides.length === 0) return null;

  const slide = slides[currentSlide];

  // ✅ Image Path Helper: Yeh function ensure karega ki image hamesha backend se load ho
  const getImageUrl = (imagePath) => {
    if (!imagePath) return "";
    // Agar path already full URL hai (https://...), toh wahi use karein
    if (imagePath.startsWith('http')) return imagePath;
    // Agar sirf relative path hai (/uploads/...), toh backend URL jodein
    return `${API_BASE}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
  };

  return (
    <div className="relative w-full group">
      <div className="relative w-full overflow-hidden">
        <img 
          key={slide._id} 
          src={getImageUrl(slide.image)} 
          alt={slide.title || "Banner"} 
          className="w-full h-[350px] md:h-[500px] object-cover object-top block animate-wait-zoom"
          onError={(e) => {
            console.log("Image load failed, trying fallback...");
            // Fallback: Agar upar wala fail ho jaye toh direct uploads path try karein
            const fileName = slide.image.split('/').pop();
            e.target.src = `${API_BASE}/uploads/sliders/${fileName}`;
          }}
        />

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="container mx-auto px-6 flex flex-col items-start justify-center h-full">
            <div className="md:w-1/2 text-left space-y-4 md:space-y-6 pl-0 md:pl-12 pt-8 md:pt-0 pointer-events-auto">
              {slide.title && (
                <h2 className="text-2xl md:text-5xl font-bold text-white drop-shadow-2xl bg-black/30 p-4 rounded-lg">
                  {slide.title}
                </h2>
              )}
            </div>
          </div>
        </div>
      </div>

      <button onClick={prevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/30 hover:bg-white z-20 transition opacity-0 group-hover:opacity-100">
        <ChevronLeft size={24} className="text-gray-800" />
      </button>
      <button onClick={nextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/30 hover:bg-white z-20 transition opacity-0 group-hover:opacity-100">
        <ChevronRight size={24} className="text-gray-800" />
      </button>

      <div className="bg-[#Fdfbf7] py-4 border-t border-gray-200">
        <div className="container mx-auto flex flex-wrap justify-center gap-6 md:gap-12 text-gray-700 text-xs md:text-sm font-bold px-4">
          <div className="flex items-center gap-2"><Truck size={18} className="text-red-600" /> FREE SHIPPING</div>
          <div className="flex items-center gap-2"><ShieldCheck size={18} className="text-red-600" /> SECURE CHECKOUT</div>
          <div className="flex items-center gap-2"><Stethoscope size={18} className="text-red-600" /> FREE DOCTOR CONSULTATION</div>
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