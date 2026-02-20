import React, { useState, useEffect } from "react";
import { Sparkles, Droplets, Leaf, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import instance, { getImageUrl } from "./api/AxiosConfig";

const FindDosha = () => {
  const navigate = useNavigate();
  const [findOffer, setFindOffer] = useState(null);
  const [loading, setLoading] = useState(true);

  // Default images as fallback
  const defaultImage = "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1200&q=80";

  useEffect(() => {
    fetchFindOffer();
  }, []);

  const fetchFindOffer = async () => {
    try {
      const res = await instance.get("/api/offer-content/type/findOffer");
      if (res.data.success && res.data.data) {
        setFindOffer(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching find offer:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCtaClick = () => {
    if (findOffer?.productId) {
      navigate(`/product/${findOffer.productId._id}`);
    }
    // If no product linked, could open a quiz modal or navigate to quiz page
  };

  if (loading) {
    return (
      <div className="py-16 bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#A88B56]"></div>
      </div>
    );
  }

  // Use API data if available, otherwise use defaults
  const displayImage = findOffer?.image ? getImageUrl(findOffer.image) : defaultImage;
  const displayTitle = findOffer?.title || "Find Your Perfect Routine";
  const displayDescription = findOffer?.description || "Discover which Lebrostone essentials are made for your unique skin type.";
  const ctaText = findOffer?.ctaText || "Start Analysis";

  return (
    <div className="py-16 bg-white">
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24 max-w-7xl mx-auto">
          {/* LEFT: Image Section */}
          <div className="w-full lg:w-1/2 relative">
            <div className="relative rounded-[3rem] overflow-hidden shadow-2xl group">
              <img
                src={displayImage}
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
              {displayTitle.split(' ').slice(0, -1).join(' ')} <br />
              <span className="text-[#A88B56]">{displayTitle.split(' ').slice(-1).join(' ')}</span>
            </h2>
            <p className="text-slate-500 text-xl font-medium leading-relaxed max-w-md">
              {displayDescription}
            </p>
            <button 
              onClick={handleCtaClick}
              className="bg-slate-900 text-white px-12 py-5 rounded-full text-xs font-black uppercase tracking-[0.3em] hover:bg-[#A88B56] transition-all"
            >
              {ctaText} <ArrowRight size={20} className="inline ml-2" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FindDosha;
