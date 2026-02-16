import React from "react";
import { Sparkles, Droplets, Leaf, ArrowRight } from "lucide-react";

const FindDosha = () => {
  // ✅ Ye public images hain, ye 100% load hongi
  const yogaBanner =
    "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1200&q=80";
  const ayurvedaBanner =
    "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&w=1200&q=80";

  return (
    <div className="py-16 bg-white">
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24 max-w-7xl mx-auto">
          {/* LEFT: Image Section */}
          <div className="w-full lg:w-1/2 relative">
            <div className="relative rounded-[3rem] overflow-hidden shadow-2xl group">
              <img
                src={yogaBanner} // 👈 Direct HTTPS Link
                alt="Wellness"
                className="w-full h-[500px] object-cover transition-transform duration-1000 group-hover:scale-110"
              />

              <div className="absolute inset-0 bg-black/5"></div>

              {/* Floating Glass Icons */}
              <div className="absolute top-10 left-10 flex flex-col gap-6">
                <div className="p-4 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl animate-bounce">
                  <Sparkles size={28} className="text-[#A88B56]" />
                </div>
                <div className="p-4 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl animate-bounce delay-150">
                  <Droplets size={28} className="text-[#A88B56]" />
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Text Content */}
          <div className="w-full lg:w-1/2 text-left space-y-10">
            <h2 className="text-5xl md:text-7xl font-black text-slate-900 leading-[0.9] uppercase tracking-tighter italic">
              Find Your <br />
              <span className="text-[#A88B56]">Perfect Routine</span>
            </h2>
            <p className="text-slate-500 text-xl font-medium leading-relaxed max-w-md">
              Discover which <b>Lebrostone</b> essentials are made for your
              unique skin type.
            </p>
            <button className="bg-slate-900 text-white px-12 py-5 rounded-full text-xs font-black uppercase tracking-[0.3em] hover:bg-[#A88B56] transition-all">
              Start Analysis <ArrowRight size={20} className="inline ml-2" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FindDosha;
