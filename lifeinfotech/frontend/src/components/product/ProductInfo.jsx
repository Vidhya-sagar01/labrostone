import React, { useMemo } from 'react';
import { Plus } from 'lucide-react';

const ProductInfo = ({ product, selectedVariant, setSelectedVariant }) => {
  // --- SAFE CHECK ---
  if (!product) {
    return <div className="p-4 text-gray-500 font-bold animate-pulse">Syncing Product Data...</div>;
  }

  // ✅ 1. Combined Logic: Combo Calculation OR Variant Filtering (PRIORITY FIXED)
  const { standardPack, otherVariants } = useMemo(() => {
    
    // Database Values
    const rootSP = Number(product.selling_price);
    const rootMRP = Number(product.mrp);

    // --- CASE A: AGAR ROOT SELLING PRICE HAI (Priority 1) ---
    // Chahe wo combo ho ya normal, agar 500 likha hai to wahi final hai.
    if (rootSP > 0) {
         const main = {
            _id: product._id,
            size: product.is_combo ? 'Standard Pack' : (product.variants?.[0]?.size || 'Standard'),
            selling_price: rootSP,
            mrp: rootMRP > 0 ? rootMRP : rootSP,
            is_combo: product.is_combo
         };
         
         // Filter logic for other variants
         const others = (product.variants || []).filter(v => {
            const price = Number(v.selling_price || v.price); 
            const size = (v.size || "").toLowerCase();
            // Duplicate 'Standard' variants ko list se hatao
            return price > 0 && size !== "standard" && size !== "standard pack";
        });

        return { standardPack: main, otherVariants: others };
    }

    // --- CASE B: AGAR VARIANTS HAIN (Priority 2) ---
    if (product.variants && product.variants.length > 0 && product.variants.some(v => v.selling_price > 0)) {
         const main = {
             ...product.variants[0],
             is_combo: product.is_combo
         };
         const others = product.variants.slice(1);
         return { standardPack: main, otherVariants: others };
    }

    // --- CASE C: AGAR COMBO HAI AUR PRICE 0 HAI (Priority 3 - Calculation) ---
    if (product.is_combo && product.included_products?.length > 0) {
        let finalSP = 0;
        let finalMRP = 0;
        
        product.included_products.forEach(item => {
            if (item && typeof item === 'object') {
                const itemSP = Number(item.selling_price) || Number(item.variants?.[0]?.selling_price) || 0;
                const itemMRP = Number(item.mrp) || Number(item.variants?.[0]?.mrp) || 0;
                finalSP += itemSP;
                finalMRP += (itemMRP || itemSP);
            }
        });

        return {
            standardPack: {
                _id: 'combo-calc', 
                size: 'Combo Bundle',
                selling_price: finalSP,
                mrp: finalMRP,
                is_combo: true
            },
            otherVariants: [] 
        };
    }

    // --- Fallback ---
    return {
        standardPack: {
            _id: 'fallback',
            size: 'Standard',
            selling_price: 0,
            mrp: 0,
            is_combo: false
        },
        otherVariants: []
    };

  }, [product]);

  // ✅ 2. Active Variant logic
  const activeVariant = selectedVariant || standardPack;

  const getDiscount = (mrp, sp) => {
    if (!mrp || !sp || mrp <= sp) return 0;
    return Math.round(((mrp - sp) / mrp) * 100);
  };

  return (
    <div className="flex flex-col font-sans text-[#212121]">
      {/* --- 1. TOP SECTION: Product Name & Tagline --- */}
      <div className="mb-6">
        <h1 className="text-[24px] md:text-[28px] font-black leading-tight mb-1 uppercase text-slate-900">
          {product.name}
        </h1>
        <p className="text-[14px] text-[#a88b56] font-bold italic mb-4 uppercase">
          {product.tagline || (activeVariant.is_combo ? "Value Pack Bundle" : "Premium Natural Care")}
        </p>
        
        {/* Dynamic Price Banner */}
        <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100 transition-all duration-300">
           <div className="flex flex-col">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                {activeVariant.is_combo ? "Total Combo Value" : `Selected: ${activeVariant.size}`}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black text-slate-900">₹{activeVariant.selling_price || activeVariant.price}</span>
                
                {activeVariant.mrp > (activeVariant.selling_price || activeVariant.price) && (
                  <>
                    <span className="text-sm text-slate-400 line-through">₹{activeVariant.mrp}</span>
                    <span className="text-[10px] bg-emerald-500 text-white px-2 py-0.5 rounded-full font-bold">
                        SAVE ₹{(activeVariant.mrp || 0) - (activeVariant.selling_price || activeVariant.price || 0)}
                    </span>
                  </>
                )}
              </div>
           </div>
        </div>
      </div>

      {/* --- 2. VARIANT / COMBO SELECTION SECTION --- */}
      <div className="mb-8">
        
        {/* === CONDITION 1: AGAR COMBO HAI (Show Items Images) === */}
        {activeVariant.is_combo ? (
            <div className="space-y-4">
            <span className="block font-black text-[12px] text-emerald-600 uppercase tracking-[0.2em] italic">
                ✨ Items in this Combo
            </span>
            <div className="bg-white border-2 border-slate-100 rounded-[2rem] p-6 flex items-center justify-around gap-4 shadow-sm">
                {product.included_products?.map((item, idx) => (
                <React.Fragment key={idx}>
                    <div className="flex flex-col items-center text-center gap-2 group">
                    <div className="w-16 h-16 bg-slate-50 rounded-xl border border-slate-100 p-2 overflow-hidden">
                        <img 
                        src={item?.images?.[0] || "https://via.placeholder.com/150"} 
                        className="w-full h-full object-contain" 
                        alt="item" 
                        />
                    </div>
                    <span className="text-[9px] font-black text-slate-700 uppercase tracking-tighter max-w-[70px] leading-tight">
                        {item?.name || "Product Item"}
                    </span>
                    </div>
                    {idx < product.included_products.length - 1 && (
                    <Plus size={16} className="text-slate-300 font-bold" />
                    )}
                </React.Fragment>
                ))}
            </div>
            </div>
        ) : (
            /* === CONDITION 2: AGAR NORMAL HAI (Show Big Box + Grid) === */
            <>
                <span className="block font-black text-[12px] mb-4 text-gray-800 uppercase tracking-widest text-center md:text-left">
                    Choose Your Size
                </span>

                {/* A. STANDARD PACK (Top Row - Big Box) */}
                <div 
                    onClick={() => setSelectedVariant(standardPack)}
                    className={`relative cursor-pointer border-2 rounded-2xl p-4 mb-4 transition-all flex items-center justify-between ${
                    activeVariant?._id === standardPack._id
                        ? 'border-[#00AFEF] bg-blue-50/30 shadow-md scale-[1.01]' 
                        : 'border-slate-100 bg-white hover:border-slate-200'
                    }`}
                >
                    <div className="flex flex-col">
                        <div className="font-black text-[15px] text-slate-800 uppercase italic">STANDARD PACK</div>
                        <div className="text-[11px] text-slate-400 font-bold uppercase tracking-tighter">
                            FULL SIZE - {product.net_content || standardPack.size}
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="font-black text-[18px] text-slate-900">₹{standardPack.selling_price}</div>
                        <div className="text-[11px] text-emerald-600 font-bold uppercase">
                            {getDiscount(standardPack.mrp, standardPack.selling_price)}% Off Today
                        </div>
                    </div>
                </div>

                {/* B. OTHER VARIANTS (Bottom Grid - Filtered) */}
                {otherVariants.length > 0 ? (
                    <div className="grid grid-cols-3 gap-3">
                    {otherVariants.map((variant, idx) => (
                        <div 
                        key={variant._id || idx}
                        onClick={() => setSelectedVariant(variant)}
                        className={`relative cursor-pointer border-2 rounded-xl p-3 transition-all flex flex-col min-h-[100px] items-center justify-center text-center ${
                            activeVariant?._id === variant._id 
                            ? 'border-[#00AFEF] bg-white shadow-md scale-[1.05] z-10' 
                            : 'border-slate-100 bg-white hover:border-slate-200'
                        }`}
                        >
                        <div className="font-black text-[13px] text-slate-800 mb-1">{variant.size}</div>
                        <div className="font-black text-[15px] text-slate-900">₹{variant.selling_price || variant.price}</div>
                        <div className="text-[10px] text-emerald-600 font-bold uppercase">
                            {getDiscount(variant.mrp, (variant.selling_price || variant.price))}% OFF
                        </div>
                        </div>
                    ))}
                    </div>
                ) : (
                    <div className="text-center py-4 border border-dashed rounded-xl text-gray-400 text-[10px] uppercase font-bold">
                        No small sizes available
                    </div>
                )}
            </>
        )}

      </div>
    </div>
  );
};

export default ProductInfo;