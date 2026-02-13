// import React, { useRef, useEffect, useState } from 'react';
// import { ChevronLeft, ChevronRight } from 'lucide-react';

// const TopIngredients = () => {
//   const API_BASE_URL = "http://localhost:5000"; 

//   const ingredients = [
//     { id: 1, name: "Aloe Vera", image: "1.jpg", description: "Soothes and hydrates skin." },
//     { id: 2, name: "Tulsi (Holy Basil)", image: "2.webp", description: "Purifying and anti-bacterial." },
//     { id: 3, name: "Turmeric (Haldi)", image: "3.jpeg", description: "Brightens and fights inflammation." },
//     { id: 4, name: "Neem", image: "4.webp", description: "Clears acne and detoxifies." },
//     { id: 5, name: "Saffron (Kesar)", image: "5.webp", description: "Adds glow and radiance." },
//     { id: 6, name: "Sandalwood", image: "6.jpg", description: "Cools and calms irritation." },
//     { id: 7, name: "Amla", image: "7.webp", description: "Rich in Vitamin C for anti-aging." },
//     { id: 8, name: "Rose Water", image: "8.jpg", description: "Tones and refreshes pores." },
//   ];

//   const getImageUrl = (imageName) => {
//     if (imageName.startsWith('http')) return imageName;
//     return `${API_BASE_URL}/uploads/ingridient/${imageName}`;
//   };

//   const scrollRef = useRef(null);
//   const [isPaused, setIsPaused] = useState(false);

//   useEffect(() => {
//     if (isPaused) return;

//     const interval = setInterval(() => {
//       if (scrollRef.current) {
//         const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
//         if (scrollLeft + clientWidth >= scrollWidth - 4) {
//             scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
//         } else {
//             scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
//         }
//       }
//     }, 3000);

//     return () => clearInterval(interval);
//   }, [isPaused]);

//   const scroll = (direction) => {
//     if (scrollRef.current) {
//       const { current } = scrollRef;
//       const scrollAmount = 300;
//       if (direction === 'left') {
//         current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
//       } else {
//         current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
//       }
//     }
//   };

//   return (
//     // ✅ FIX 1: 'w-full' and 'overflow-hidden' added to prevent page scroll
//     <section className="py-12 bg-[#FFFBF0] font-sans w-full overflow-hidden">
//       <div className="container mx-auto px-4">
        
//         {/* Banner */}
//         <div className="w-[95%] md:w-[85%] mx-auto mb-10 bg-[#124E78] rounded-tr-[50px] rounded-bl-[50px] border-[5px] border-[#A3D9B8] py-4 px-6 shadow-md relative overflow-hidden">
//           <h2 className="text-xl md:text-3xl font-bold text-center text-[#FFC0CB] uppercase tracking-[0.15em] relative z-10 drop-shadow-sm">
//             Shop By Ingredients
//           </h2>
//         </div>

//         {/* Carousel Container */}
//         <div 
//             className="relative px-2 md:px-12 group max-w-full"
//             onMouseEnter={() => setIsPaused(true)}
//             onMouseLeave={() => setIsPaused(false)}
//         >
            
//             {/* Left Arrow Button */}
//             {/* ✅ FIX 2: Removed negative margins (-ml), used 'left-0' or 'left-2' */}
//             <button 
//               onClick={() => scroll('left')}
//               className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white border border-gray-200 rounded-full items-center justify-center text-[#124E78] shadow-lg hover:bg-[#124E78] hover:text-white transition-all duration-300 hidden md:flex"
//             >
//               <ChevronLeft size={24} />
//             </button>

//             {/* Scrollable Div */}
//             <div 
//               ref={scrollRef}
//               className="flex overflow-x-auto snap-x snap-mandatory gap-4 md:gap-6 pb-8 scrollbar-hide w-full" 
//               style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
//             >
//             {ingredients.map((item) => (
//                 <div 
//                   key={item.id} 
//                   className="snap-center shrink-0 w-[160px] sm:w-[200px] md:w-[240px] h-[220px] sm:h-[260px] md:h-[300px] relative rounded-2xl overflow-hidden group cursor-pointer shadow-md hover:shadow-xl transition-all duration-300 ease-in-out bg-white border border-[#A3D9B8]"
//                 >
                
//                 {/* Full Image */}
//                 <div className="w-full h-full bg-white flex items-center justify-center relative">
//                   <img 
//                       src={getImageUrl(item.image)} 
//                       alt={item.name} 
//                       className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
//                       onError={(e) => { 
//                         e.target.onerror = null; 
//                         e.target.src = `https://via.placeholder.com/400x400/FFFBF0/124E78?text=${item.name}`; 
//                       }} 
//                   />
//                   <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-100 pointer-events-none"></div>
//                 </div>

//                 {/* Text */}
//                 <div className="absolute bottom-0 left-0 right-0 p-4 text-center translate-y-1 group-hover:translate-y-0 transition-transform duration-300 z-10">
//                     <h3 className="text-[#A3D9B8] text-base md:text-lg font-bold uppercase tracking-wider drop-shadow-md mb-1">
//                       {item.name}
//                     </h3>
//                     <p className="text-white text-[10px] md:text-xs opacity-90 group-hover:opacity-100 transition-opacity duration-300 font-medium">
//                         {item.description}
//                     </p>
//                 </div>
//                 </div>
//             ))}
//             </div>
            
//             {/* Right Arrow Button */}
//             {/* ✅ FIX 3: Removed negative margins (-mr), used 'right-2' */}
//             <button 
//               onClick={() => scroll('right')}
//               className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white border border-gray-200 rounded-full items-center justify-center text-[#124E78] shadow-lg hover:bg-[#124E78] hover:text-white transition-all duration-300 hidden md:flex"
//             >
//               <ChevronRight size={24} />
//             </button>

//              {/* Pagination Dots */}
//              <div className="flex justify-center gap-2 mt-2">
//                 {[...Array(4)].map((_, i) => (
//                     <div key={i} className={`h-1.5 rounded-full ${i === 0 ? 'w-6 bg-[#124E78]' : 'w-1.5 bg-gray-300'}`}></div>
//                 ))}
//             </div>
//         </div>

//       </div>
//        <style jsx>{`
//         .scrollbar-hide::-webkit-scrollbar {
//             display: none;
//         }
//       `}</style>
//     </section>
//   );
// };

// export default TopIngredients;