import React, { useState } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';

const Reviews = () => {
  // --- 1. ALAG-ALAG CONTENT KA DATA ---
  const reviewData = [
    {
      id: 1,
      name: "Manhar bedi",
      product: "Anti Acne Facial Kit",
      price: "₹ 239",
      image: "/reviews/reviews1.png", 
      text: "I have been using this for product for six weeks now. Cleared out my acne and old acne marks are lesser too now.",
      rating: 5
    },
    {
      id: 2,
      name: "Anjali Saini",
      product: "Rose Glow Facial Kit",
      price: "₹ 439",
      image: "/reviews/reviews2.png",
      text: "I love the products & packaging also gifted the facial kit to my friend. Skin feels hydrated and glowing!",
      rating: 5
    },
    {
      id: 3,
      name: "Vikram Rathore",
      product: "Hair Growth Tonic",
      price: "₹ 719",
      image: "/reviews/reviews3.png",
      text: "Visible hair regrowth in just 40 days. Highly recommended for hair fall issues.",
      rating: 5
    },
    {
      id: 4,
      name: "Priya Sharma",
      product: "Kumkumadi Serum",
      price: "₹ 1,836",
      image: "/reviews/reviews4.png",
      text: "This serum changed my skin texture. It looks so much brighter and healthier now.",
      rating: 5
    },
    {
      id: 5,
      name: "Sandeep Gill",
      product: "Face Revitalizer",
      price: "₹ 2,399",
      image: "/reviews/reviews5.png",
      text: "Best product for tired skin. I use it every night and wake up with glowing skin.",
      rating: 5
    },
    {
      id: 6,
      name: "Rahul Verma",
      product: "Neem Face Wash",
      price: "₹ 349",
      image: "/reviews/reviews6.png", 
      text: "Very gentle on skin and effective against pimples. Great for oily skin types.",
      rating: 5
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsToShow = 4; // Desktop par 3 cards dikhenge
  const maxIndex = reviewData.length - itemsToShow;

  // --- 2. CLICK HANDLERS (Manual move) ---
  const nextSlide = () => {
    if (currentIndex < maxIndex) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0); // Wapas shuru mein jane ke liye
    }
  };

  const prevSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      setCurrentIndex(maxIndex); // Seedha last mein jane ke liye
    }
  };

  return (
    <div className="py-16 bg-white overflow-hidden">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 uppercase tracking-widest text-black">Reviews</h2>
        
        <div className="relative group max-w-9xl mx-auto px-12">
          
          {/* LEFT BUTTON (<) */}
          <button 
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-gray-100 hover:bg-black hover:text-white transition-all shadow-md"
          >
            <ChevronLeft size={28} />
          </button>

          {/* SLIDER WINDOW */}
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${currentIndex * (100 / itemsToShow)}%)` }}
            >
              {reviewData.map((review) => (
                <div 
                  key={review.id} 
                  className="flex-shrink-0 px-4" 
                  style={{ width: `${100 / itemsToShow}%` }}
                >
                  <div className="relative group/card h-[450px] rounded-3xl overflow-hidden shadow-lg cursor-pointer">
                    
                    {/* Background Image */}
                    <img 
                      src={review.image} 
                      alt={review.name} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-110"
                    />

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-start pt-12 opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 z-10">
                      <h4 className="text-white text-xl font-medium mb-1">{review.product}</h4>
                      <p className="text-white font-bold mb-4">{review.price}</p>
                      <button className="bg-white text-black px-6 py-2 rounded-md text-sm font-bold hover:bg-gray-200 transition-colors">
                        View Product
                      </button>
                    </div>

                    {/* Bottom Info */}
                    <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-black/90 via-black/40 to-transparent text-white">
                      <div className="flex gap-1 mb-2">
                        {[...Array(review.rating)].map((_, i) => (
                          <Star key={i} size={16} fill="#EAB308" className="text-yellow-500" />
                        ))}
                      </div>
                      <h3 className="text-lg font-bold mb-2 tracking-wide uppercase">- {review.name}</h3>
                      <p className="text-sm leading-relaxed opacity-90 line-clamp-3">
                        {review.text}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT BUTTON (>) */}
          <button 
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-gray-100 hover:bg-black hover:text-white transition-all shadow-md"
          >
            <ChevronRight size={28} />
          </button>

        </div>
      </div>
    </div>
  );
};

export default Reviews;