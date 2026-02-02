import React, { useState } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';

const Reviews = () => {
  // ✅ 1. HTTPS LIVE DATA (Sabhi local paths replace kar diye hain)
  const reviewData = [
    {
      id: 1,
      name: "Manhar bedi",
      product: "Anti Acne Facial Kit",
      price: "₹ 239",
      image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=600&auto=format&fit=crop", 
      text: "I have been using this for product for six weeks now. Cleared out my acne and old acne marks are lesser too now.",
      rating: 5
    },
    {
      id: 2,
      name: "Anjali Saini",
      product: "Rose Glow Facial Kit",
      price: "₹ 439",
      image: "https://images.unsplash.com/photo-1612817288484-6f916006741a?q=80&w=600&auto=format&fit=crop",
      text: "I love the products & packaging also gifted the facial kit to my friend. Skin feels hydrated and glowing!",
      rating: 5
    },
    {
      id: 3,
      name: "Vikram Rathore",
      product: "Hair Growth Tonic",
      price: "₹ 719",
      image: "https://images.unsplash.com/photo-1527799822344-429dfa621db3?q=80&w=600&auto=format&fit=crop",
      text: "Visible hair regrowth in just 40 days. Highly recommended for hair fall issues.",
      rating: 5
    },
    {
      id: 4,
      name: "Priya Sharma",
      product: "Kumkumadi Serum",
      price: "₹ 1,836",
      image: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?q=80&w=600&auto=format&fit=crop",
      text: "This serum changed my skin texture. It looks so much brighter and healthier now.",
      rating: 5
    },
    {
      id: 5,
      name: "Sandeep Gill",
      product: "Face Revitalizer",
      price: "₹ 2,399",
      image: "https://images.unsplash.com/photo-1505944270255-bd2b88a4c915?q=80&w=600&auto=format&fit=crop",
      text: "Best product for tired skin. I use it every night and wake up with glowing skin.",
      rating: 5
    },
    {
      id: 6,
      name: "Rahul Verma",
      product: "Neem Face Wash",
      price: "₹ 349",
      image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=600&auto=format&fit=crop", 
      text: "Very gentle on skin and effective against pimples. Great for oily skin types.",
      rating: 5
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsToShow = 4; 
  const maxIndex = reviewData.length - itemsToShow;

  const nextSlide = () => {
    if (currentIndex < maxIndex) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const prevSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      setCurrentIndex(maxIndex);
    }
  };

  return (
    <div className="py-16 bg-[#FDFBF7] overflow-hidden">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-black text-center mb-12 uppercase italic tracking-tighter text-slate-900">
          Customer <span className="text-[#A88B56]">Reviews</span>
        </h2>
        
        <div className="relative group max-w-7xl mx-auto px-12">
          
          <button 
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white shadow-xl text-slate-400 hover:text-black transition-all"
          >
            <ChevronLeft size={28} />
          </button>

          <div className="overflow-hidden rounded-[2.5rem]">
            <div 
              className="flex transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]"
              style={{ transform: `translateX(-${currentIndex * (100 / itemsToShow)}%)` }}
            >
              {reviewData.map((review) => (
                <div 
                  key={review.id} 
                  className="flex-shrink-0 px-4" 
                  style={{ width: `${100 / itemsToShow}%` }}
                >
                  <div className="relative group/card h-[450px] rounded-[3rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500">
                    
                    {/* ✅ Live Image Tag with Fallback */}
                    <img 
                      src={review.image} 
                      alt={review.name} 
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover/card:scale-110"
                      onError={(e) => { e.target.src = "https://via.placeholder.com/600x800?text=Lebrostone+Ayurveda"; }}
                    />

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 z-10 px-6 text-center">
                      <h4 className="text-white text-xl font-black uppercase italic mb-1">{review.product}</h4>
                      <p className="text-orange-200 font-bold mb-6">{review.price}</p>
                      <button className="bg-white text-black px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest hover:bg-[#A88B56] hover:text-white transition-all">
                        View Product
                      </button>
                    </div>

                    {/* Bottom Info */}
                    <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-black/90 via-black/40 to-transparent text-white">
                      <div className="flex gap-1 mb-3">
                        {[...Array(review.rating)].map((_, i) => (
                          <Star key={i} size={14} fill="#A88B56" className="text-[#A88B56]" />
                        ))}
                      </div>
                      <h3 className="text-lg font-black mb-2 tracking-tight uppercase italic">- {review.name}</h3>
                      <p className="text-xs leading-relaxed opacity-80 line-clamp-3">
                        {review.text}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button 
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white shadow-xl text-slate-400 hover:text-black transition-all"
          >
            <ChevronRight size={28} />
          </button>

        </div>
      </div>
    </div>
  );
};

export default Reviews;