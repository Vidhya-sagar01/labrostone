// import React, { useState, useEffect, useRef } from 'react';
// import axios from 'axios';
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Navigation, Autoplay } from "swiper/modules";
// import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
// import { useNavigate } from 'react-router-dom';

// // Swiper Styles
// import "swiper/css";
// import "swiper/css/navigation";

// const ShopByCategory = () => {
//   const [categories, setCategories] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const swiperRef = useRef(null);
//   const navigate = useNavigate();

//   // ✅ Dinamic API Base (Localhost aur Production dono ke liye)
//   const API_BASE = window.location.hostname === "localhost" 
//     ? "http://localhost:5000" 
//     : "https://lebrostonebackend.lifeinfotechinstitute.com";

//   // ✅ Image Path Fix Logic (Super Robust)
//   const getImageUrl = (url) => {
//     if (!url) return "https://via.placeholder.com/400x400?text=Category";
    
//     // Agar URL poora hai (http se shuru ho raha hai)
//     if (url.startsWith('http')) return url;

//     // Path ko clean karein (Extra slashes hatayein)
//     const cleanPath = url.replace(/^\/+/, ''); 
    
//     // Final URL banayein
//     return `${API_BASE}/${cleanPath}`;
//   };

//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         setLoading(true);
//         const res = await axios.get(`${API_BASE}/api/categories`);
        
//         // Backend se aane wale data structure ko handle karein
//         const catData = res.data.data || res.data.categories || res.data || [];
        
//         // Sirf wahi categories dikhayein jo active hain (optional)
//         setCategories(Array.isArray(catData) ? catData : []);
//       } catch (err) {
//         console.error("Frontend Category Error:", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchCategories();
//   }, [API_BASE]);

//   if (loading) return (
//     <div className="flex justify-center items-center h-64 bg-white italic font-bold text-[#1D4D6F] animate-pulse uppercase tracking-widest">
//       LOADING CATEGORIES...
//     </div>
//   );

//   return (
//     <section className="py-16 bg-white font-sans overflow-hidden">
//       <div className="container mx-auto px-4">
        
//         {/* ✅ Section Header */}
//         <div className="flex justify-center mb-12">
//           <div className="bg-[#1D4D6F] text-white py-3 px-12 md:px-24 rounded-tl-[35px] rounded-br-[35px] border-[3px] border-[#A7F3D0] shadow-lg">
//             <h2 className="text-lg md:text-2xl font-bold uppercase tracking-widest text-center">
//               Shop By Category
//             </h2>
//           </div>
//         </div>

//         {/* ✅ Swiper Slider Container */}
//         <div className="relative max-w-7xl mx-auto px-2 md:px-6">
          
//           {/* Custom Navigation Buttons (Z-index fixed) */}
//           <button
//             className="absolute left-0 top-1/2 -translate-y-1/2 z-30 bg-white hover:bg-[#1D4D6F] hover:text-white text-gray-800 w-10 h-10 rounded-full shadow-xl flex items-center justify-center transition-all duration-300 -ml-2 border border-gray-100"
//             onClick={() => swiperRef.current?.slidePrev()}
//           >
//             <FaChevronLeft />
//           </button>

//           <button
//             className="absolute right-0 top-1/2 -translate-y-1/2 z-30 bg-white hover:bg-[#1D4D6F] hover:text-white text-gray-800 w-10 h-10 rounded-full shadow-xl flex items-center justify-center transition-all duration-300 -mr-2 border border-gray-100"
//             onClick={() => swiperRef.current?.slideNext()}
//           >
//             <FaChevronRight />
//           </button>

//           <Swiper
//             modules={[Navigation, Autoplay]}
//             spaceBetween={20}
//             slidesPerView={2}
//             breakpoints={{
//               480: { slidesPerView: 2 },
//               640: { slidesPerView: 3 },
//               768: { slidesPerView: 4 },
//               1024: { slidesPerView: 6 },
//             }}
//             autoplay={{
//               delay: 3000,
//               disableOnInteraction: false,
//             }}
//             loop={categories.length >= 6}
//             onBeforeInit={(swiper) => {
//               swiperRef.current = swiper;
//             }}
//             className="px-2 py-4"
//           >
//             {categories.map((cat) => (
//               <SwiperSlide key={cat._id}>
//                 <div 
//                   className="flex flex-col items-center group cursor-pointer"
//                   onClick={() => navigate(`/shop/category/${cat._id}`)}
//                 >
//                   {/* ✅ Image Container */}
//                   <div className="relative w-full aspect-square mb-4 overflow-hidden rounded-2xl shadow-sm transition-all duration-500 group-hover:shadow-xl border-2 border-transparent group-hover:border-[#1D4D6F]">
//                     <img
//                       src={getImageUrl(cat.image_url || cat.image)}
//                       alt={cat.name}
//                       className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
//                       loading="lazy"
//                       onError={(e) => { e.target.src = "https://via.placeholder.com/400x400?text=Category"; }}
//                     />
//                     {/* Overlay Effect */}
//                     <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-all duration-300" />
//                   </div>

//                   {/* ✅ Category Title */}
//                   <h3 className="text-[11px] md:text-sm font-bold text-gray-700 text-center tracking-wide uppercase group-hover:text-[#1D4D6F] transition-colors line-clamp-1 px-1">
//                     {cat.name}
//                   </h3>
//                 </div>
//               </SwiperSlide>
//             ))}
//           </Swiper>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default ShopByCategory;


import React, { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "swiper/css";
import "swiper/css/navigation";

const category = [
  {
    title: "ACNE",
    image:
      "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?q=80&w=2070&auto=format&fit=crop",
  },
  {
    title: "BLACK HEADS",
    image:
      "https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=2070&auto=format&fit=crop",
  },
  {
    title: "TANNING",
    image:
      "https://images.unsplash.com/photo-1560750588-73207b1ef5b8?q=80&w=2070&auto=format&fit=crop",
  },
  {
    title: "DRY SKIN",
    image:
      "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?q=80&w=2070&auto=format&fit=crop",
  },
  {
    title: "WRINKLES",
    image:
      "https://images.unsplash.com/photo-1611689342806-0863700ce1e4?q=80&w=2070&auto=format&fit=crop",
  },
  {
    title: "OILY SKIN",
    image:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=2070&auto=format&fit=crop",
  },
];

const Category = () => {
  const swiperRef = useRef(null);

  return (
    <section className="py-16 bg-white font-sans">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex justify-center mb-12">
          <div className=" text-black py-3 px-12 md:px-24 ">
            <h2 className="text-lg md:text-2xl font-bold uppercase tracking-widest text-center">
              Shop By Category
            </h2>
          </div>
        </div>

        {/* Swiper Container */}
        <div className="relative max-w-7xl mx-auto">
          {/* Navigation Buttons */}
          <button
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white hover:bg-gray-100 text-gray-800 w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 -ml-6"
            onClick={() => swiperRef.current?.slidePrev()}
          >
            <FaChevronLeft className="text-xl" />
          </button>

          <button
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white hover:bg-gray-100 text-gray-800 w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 -mr-6"
            onClick={() => swiperRef.current?.slideNext()}
          >
            <FaChevronRight className="text-xl" />
          </button>

          <Swiper
            modules={[Navigation, Autoplay]}
            spaceBetween={24}
            slidesPerView={2}
            breakpoints={{
              640: { slidesPerView: 3 },
              768: { slidesPerView: 4 },
              1024: { slidesPerView: 6 },
            }}
            autoplay={{
              delay: 1000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            speed={800}
            loop={true}
            onBeforeInit={(swiper) => {
              swiperRef.current = swiper;
            }}
            className="px-4"
          >
            {category.map((concern, index) => (
              <SwiperSlide key={index}>
                <div className="flex flex-col items-center group cursor-pointer">
                  {/* Image Container */}
                  <div className="relative w-full aspect-square mb-4 overflow-hidden rounded-3xl shadow-md transition-transform duration-300 group-hover:scale-105">
                    <img
                      src={concern.image}
                      alt={concern.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Title */}
                  <h3 className="text-sm md:text-base font-semibold text-gray-800 text-center tracking-wide uppercase">
                    {concern.title}
                  </h3>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default Category;