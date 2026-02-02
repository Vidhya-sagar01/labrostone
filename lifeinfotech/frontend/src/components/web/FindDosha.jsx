import React from 'react';
import { Sparkles, Droplets, Leaf, ArrowRight } from 'lucide-react';

const FindDosha = () => {
  // ✅ Base path configuration
  // Agar aapki image public/banar/banar0.jpg mein hai, toh niche wala path sahi hai.
  // Agar image server se aani hai, toh hum API_BASE use karenge.
  const bannerImagePath = "/banar/banar0.jpg"; 

  return (
    <div className="py-24 bg-[#fcfaf7]">
      <div className="container mx-auto px-6 md:px-12">
        
        {/* Main Flex Box */}
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24 max-w-7xl mx-auto">
          
          {/* LEFT: Image Section with Floating Elements */}
          <div className="w-full lg:w-1/2 relative">
            <div className="relative rounded-[3rem] overflow-hidden shadow-2xl group">
              <img 
                src={bannerImagePath} 
                alt="Ayurvedic Wellness" 
                className="w-full h-[500px] object-cover transition-transform duration-1000 group-hover:scale-110"
                // ✅ Error handling: Agar image na mile toh placeholder dikhaye
                onError={(e) => {
                  e.target.src = "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1000";
                }}
              />
              
              {/* Luxury Glass Icons Overlay */}
              <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-all duration-500"></div>
              
              <div className="absolute top-10 left-10 flex flex-col gap-6">
                <div className="p-4 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl animate-float">
                  <Sparkles size={28} className="text-[#A88B56]" />
                </div>
                <div className="p-4 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl animate-float delay-200">
                  <Droplets size={28} className="text-[#A88B56]" />
                </div>
                <div className="p-4 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl animate-float delay-500">
                  <Leaf size={28} className="text-[#A88B56]" />
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: High-Impact Text Content */}
          <div className="w-full lg:w-1/2 text-left space-y-10">
            <div className="space-y-4">
              <h2 className="text-5xl md:text-7xl font-black text-slate-900 leading-[0.9] uppercase tracking-tighter italic">
                Confused? <br/> 
                <span className="text-[#A88B56]">Find Your <br/> Perfect Routine</span>
              </h2>
              <div className="w-24 h-1.5 bg-[#A88B56] rounded-full"></div>
            </div>
            
            <p className="text-slate-500 text-xl font-medium leading-relaxed max-w-md">
              Discover which <b>Lebrostone</b> essentials are made for your unique skin and body type through our expert analysis.
            </p>
            
            <button className="group relative flex items-center gap-6 bg-slate-900 text-white px-12 py-5 rounded-full text-xs font-black uppercase tracking-[0.3em] overflow-hidden transition-all hover:bg-[#A88B56] hover:shadow-2xl hover:shadow-[#A88B56]/30">
              <span className="relative z-10">Start Skin Analysis</span>
              <ArrowRight size={20} className="relative z-10 transition-transform group-hover:translate-x-2" />
            </button>
          </div>

        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0); }
          50% { transform: translateY(-15px) rotate(5deg); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        .delay-200 { animation-delay: 0.5s; }
        .delay-500 { animation-delay: 1s; }
      `}</style>
    </div>
  );
};

export default FindDosha;