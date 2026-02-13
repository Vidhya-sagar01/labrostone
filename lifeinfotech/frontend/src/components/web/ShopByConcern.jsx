// import React, { useState, useEffect } from 'react';
// import { ChevronLeft, ChevronRight } from 'lucide-react';

// const ShopByConcern = () => {
//   // 🟢 IMPORTANT: Apna Backend URL yahan set karein (Port 5000, 4000, etc.)
//   const BACKEND_URL = "https://lebrostonebackend.lifeinfotechinstitute.com";

//   // ✅ DATA: Ab images Local Backend folder se aayengi
//   // Path logic: backend/public/uploads/concern/filename.webp
//   const categories = [
//     { 
//       id: 1, 
//       name: "Acne", 
//       // Agar file ka naam '1.webp' hai:
//       image: `${BACKEND_URL}/uploads/concern/1.webp` 
//     },
//     { 
//       id: 2, 
//       name: "Black Heads", 
//       image: `${BACKEND_URL}/uploads/concern/2.webp` 
//     },
//     { 
//       id: 3, 
//       name: "Tanning", 
//       image: `${BACKEND_URL}/uploads/concern/3.webp` 
//     },
//     { 
//       id: 4, 
//       name: "Dry Skin", 
//       image: `${BACKEND_URL}/uploads/concern/4.webp` 
//     },
//     { 
//       id: 5, 
//       name: "Wrinkles", 
//       // Aapne jo file di thi (5.webp) wo yahan hai:
//       image: `${BACKEND_URL}/uploads/concern/5.webp` 
//     },
//     { 
//       id: 6, 
//       name: "Oily Skin", 
//       image: `${BACKEND_URL}/uploads/concern/6.jpg` 
//     },
//     { 
//       id: 7, 
//       name: "Hair Fall", 
//       image: `${BACKEND_URL}/uploads/concern/7.webp` 
//     },
//     { 
//       id: 8, 
//       name: "Dandruff", 
//       image: `${BACKEND_URL}/uploads/concern/8.avif` 
//     },
//   ];

//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [itemsToShow, setItemsToShow] = useState(6);
//   const [isPaused, setIsPaused] = useState(false);

//   // --- RESPONSIVE LOGIC ---
//   useEffect(() => {
//     const handleResize = () => {
//       if (window.innerWidth < 640) {
//         setItemsToShow(2);
//       } else if (window.innerWidth < 1024) {
//         setItemsToShow(3);
//       } else {
//         setItemsToShow(6);
//       }
//     };

//     handleResize(); 
//     window.addEventListener('resize', handleResize);
//     return () => window.removeEventListener('resize', handleResize);
//   }, []);

//   const maxIndex = Math.max(0, categories.length - itemsToShow);

//   const nextSlide = () => {
//     setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
//   };

//   const prevSlide = () => {
//     setCurrentIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
//   };

//   // Auto-Play Logic
//   useEffect(() => {
//     if (isPaused) return;
//     const interval = setInterval(() => {
//       nextSlide();
//     }, 3000);
//     return () => clearInterval(interval);
//   }, [currentIndex, maxIndex, isPaused]); 

//   return (
//     <div className="py-12 bg-white font-sans">
//       <div className="container mx-auto px-4">
        
//         {/* Heading Style */}
//         <div className="w-[95%] md:w-[85%] mx-auto mb-12 bg-[#124E78] rounded-tr-[50px] rounded-bl-[50px] border-[5px] border-[#A3D9B8] py-4 px-6 shadow-md">
//           <h2 className="text-xl md:text-3xl font-bold text-center text-[#FFC0CB] uppercase tracking-[0.2em]">
//             Shop By Concern
//           </h2>
//         </div>

//         {/* Slider Container */}
//         <div 
//           className="relative group px-2 md:px-12"
//           onMouseEnter={() => setIsPaused(true)}
//           onMouseLeave={() => setIsPaused(false)}
//         >
          
//           {/* Left Arrow */}
//           <button 
//             onClick={prevSlide}
//             className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/90 border border-gray-200 rounded-full flex items-center justify-center text-gray-600 hover:bg-black hover:text-white transition-all shadow-md active:scale-95"
//           >
//             <ChevronLeft size={24} />
//           </button>

//           {/* Slider Window */}
//           <div className="overflow-hidden rounded-xl">
//             <div 
//               className="flex transition-transform duration-700 ease-in-out"
//               style={{ transform: `translateX(-${currentIndex * (100 / itemsToShow)}%)` }}
//             >
//               {categories.map((cat) => (
//                 <div 
//                   key={cat.id} 
//                   className="flex-shrink-0 px-3"
//                   style={{ width: `${100 / itemsToShow}%` }}
//                 >
//                   {/* Aspect Ratio Card */}
//                   <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer group/card border border-gray-100 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                    
//                     {/* Image */}
//                     <img 
//                       src={cat.image} 
//                       alt={cat.name} 
//                       className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-110"
//                       // Agar image load na ho (Backend off ho), to Placeholder dikhayega
//                       onError={(e) => { 
//                           e.target.onerror = null;
//                           e.target.src = ""; 
//                       }} 
//                     />
                    
//                     {/* Gradient Overlay */}
//                     <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent"></div>

//                     {/* Content Layer */}
//                     <div className="absolute bottom-4 left-0 right-0 text-center">
//                       <span className="text-white text-sm md:text-base font-bold uppercase tracking-wider drop-shadow-md">
//                         {cat.name}
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Right Arrow */}
//           <button 
//             onClick={nextSlide}
//             className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/90 border border-gray-200 rounded-full flex items-center justify-center text-gray-600 hover:bg-black hover:text-white transition-all shadow-md active:scale-95"
//           >
//             <ChevronRight size={24} />
//           </button>

//         </div>
//       </div>
//     </div>
//   );
// };

// export default ShopByConcern;




import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const concerns = [
  {
    title: "Acne",
    image:
      "https://dr.rashel.in/cdn/shop/collections/Dr.Rashel_Acne.jpg?v=1759745165&width=400",
  },
  {
    title: "Black Heads",
    image:
      "https://dr.rashel.in/cdn/shop/collections/blackheads_nose.png?v=1750921936&width=400",
  },
  {
    title: "Tanning",
    image:
      "https://dr.rashel.in/cdn/shop/collections/Dr.Rashel_Tann_Skin.jpg?v=1759746391&width=400",
  },
  {
    title: "Dry Skin",
    image:
      "https://dr.rashel.in/cdn/shop/collections/Dr.Rashel_Dry_Skin.jpg?v=1759746209&width=400",
  },
  {
    title: "Wrinkles",
    image:
      "https://dr.rashel.in/cdn/shop/collections/Dr.Rashel_Wrinkles.jpg?v=1759745336&width=400",
  },
  {
    title: "Oily Skin",
    image:
      "https://dr.rashel.in/cdn/shop/collections/Dr.Rashel_Oily_Skin.jpg?v=1759746033&width=400",
  },
];

const ingredients = [
  {
    title: "Rice Water",
    image:
      "https://dr.rashel.in/cdn/shop/collections/Website_Ingrident-03.jpg?v=1759903135&width=600",
  },
  {
    title: "Charcoal",
    image:
      "https://dr.rashel.in/cdn/shop/collections/Rice_Water_Products_11zon.jpg?v=1759902898&width=600",
  },
  {
    title: "Vitamin C",
    image:
      "https://dr.rashel.in/cdn/shop/collections/Charcoal_Skincare_Products.jpg?v=1759902696&width=600",
  },
  {
    title: "Aloe Vera",
    image:
      "https://dr.rashel.in/cdn/shop/collections/vitamin_c_e05f41b5-2e0d-4e03-b9a2-34034460bc90.jpg?v=1759902609&width=600",
  },
  {
    title: "Ubtan",
    image:
      "https://dr.rashel.in/cdn/shop/collections/Ubtan_Collection.jpg?v=1759903025&width=600",
  },
  {
    title: "Coffee",
    image:
      "https://dr.rashel.in/cdn/shop/collections/Website_Ingrident-04.jpg?v=1759903258&width=600",
  },
];

const SectionHeader = ({ title }) => (
  <div className="flex justify-center mb-10">
    <div className=" text-black py-3 px-12 md:px-24 ">
      <h2 className="text-lg md:text-2xl font-bold uppercase tracking-wider text-center">
        {title}
      </h2>
    </div>
  </div>
);

const ShopByConcern = () => {
  return (
    <div className="py-12 bg-white px-4 md:px-8">
      {/* Shop By Concern Section */}
      <div className="max-w-7xl mx-auto mb-20 ">
        <div className="flex justify-center mb-10">
          <div className=" text-black py-3 px-12 md:px-24 ">
            <h2 className="text-lg md:text-2xl font-bold uppercase tracking-wider text-center ">
              Shop By Concern
            </h2>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 md:gap-6 mt-8">
          {concerns.map((item, index) => (
            <div
              key={index}
              className="flex flex-col items-center group cursor-pointer"
            >
              <div className="w-full aspect-square overflow-hidden rounded-2xl border border-gray-100 shadow-sm transition-transform duration-300 group-hover:scale-105">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="mt-4 text-xs md:text-sm font-semibold text-gray-700 uppercase tracking-wide">
                {item.title}
              </p>
            </div>
          ))}
        </div>
      </div>
      <div className="w-full px-10 h-80 rounded-xl overflow-hidden mb-15 ">
        <div className="w-full h-full rounded-xl bg-[url('/banner-ls.jpg')] bg-cover bg-center bg-no-repeat">
          <div className="flex flex-col  p-20 text-white text-sm md:text-base font-bold uppercase tracking-wide">
            <h1 className="text-2xl font-bold">Natural Ayurvedic Wellness</h1>
            <p className="text-sm md:text-base font-normal tracking-wide">
              Pure herbal solutions for immunity, skin care, hair growth &
              complete daily health.
            </p>
          </div>
        </div>
      </div>
      {/* Shop By Ingredients Section */}
      <div className="max-w-7xl mx-auto mt-10">
        <SectionHeader title="Shop By Ingredients" />
        <div className="mt-10 relative">
          <Swiper
            modules={[Autoplay]}
            autoplay={{
              delay: 1000,
              disableOnInteraction: false,
            }}
            spaceBetween={20}
            slidesPerView={1.5}
            pagination={{ clickable: true, el: ".custom-pagination" }}
            breakpoints={{
              640: { slidesPerView: 2.5 },
              768: { slidesPerView: 3.5 },
              1024: { slidesPerView: 5.2 },
            }}
            className="pb-16"
          >
            {ingredients.map((item, index) => (
              <SwiperSlide key={index}>
                <div className="relative aspect-square overflow-hidden rounded-3xl group cursor-pointer border border-gray-100 shadow-md">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  {/* Overlay for text */}
                  <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/70 to-transparent p-4">
                    <p className="text-white text-sm md:text-base font-bold uppercase tracking-wide">
                      {item.title}
                    </p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom Pagination Container */}
          <div className="custom-pagination flex justify-center gap-2 -mt-8"></div>
          
        </div>
      </div>

      <style jsx>{`
        .custom-pagination :global(.swiper-pagination-bullet) {
          width: 8px;
          height: 8px;
          background-color: #d1d5db;
          opacity: 1;
        }
        .custom-pagination :global(.swiper-pagination-bullet-active) {
          background-color: #1a1a1a;
          width: 12px;
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
};

export default ShopByConcern;
