import React, { useState, useRef } from "react";
import { FaStar, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

const TopPicks = () => {
  const [activeTab, setActiveTab] = useState("BESTSELLERS");
  const swiperRef = useRef(null);

  const categories = ["BESTSELLERS", "NEW ARRIVAL", "COMBO"];

  const allProducts = [
    {
      id: 1,
      title: "Lebrostone Shilajit",
      price: 229,
      originalPrice: 349,
      reviews: 88,
      image:
        "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=1000&auto=format&fit=crop",
      badge: "NEW LAUNCH",
      category: "BESTSELLERS",
    },
    {
      id: 2,
      title: "Jamun Powder",
      price: 299,
      originalPrice: 399,
      reviews: 93,
      image:
        "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?q=80&w=1000&auto=format&fit=crop",
      badge: "NEW",
      category: "BESTSELLERS",
    },
    {
      id: 3,
      title: "Ashwagandha Powder",
      price: 259,
      originalPrice: 359,
      reviews: 64,
      image:
        "https://images.unsplash.com/photo-1590086782792-42dd2350140d?q=80&w=1000&auto=format&fit=crop",
      badge: "NEW",
      category: "NEW ARRIVAL",
    },
    {
      id: 4,
      title: "Neem Capsules",
      price: 199,
      originalPrice: 299,
      reviews: 41,
      image:
        "https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?q=80&w=1000&auto=format&fit=crop",
      badge: "NEW",
      category: "NEW ARRIVAL",
    },
    {
      id: 5,
      title: "Immunity Combo",
      price: 499,
      originalPrice: 699,
      reviews: 112,
      image:
        "https://images.unsplash.com/photo-1584467735871-bfb1a1c2b7c9?q=80&w=1000&auto=format&fit=crop",
      badge: "COMBO",
      category: "COMBO",
    },
    {
      id: 6,
      title: "Skin Care Combo",
      price: 549,
      originalPrice: 799,
      reviews: 87,
      image:
        "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?q=80&w=1000&auto=format&fit=crop",
      badge: "COMBO",
      category: "COMBO",
    },
  ];

  const filteredProducts = allProducts.filter((p) => p.category === activeTab);

  return (
    <section className="pt-10 md:pt-16 bg-white ">
      <div className="max-w-7xl mx-auto px-4">
        {/* TITLE */}
        <div className="flex justify-center mb-10">
          <div className="text-black py-3 px-12 md:px-24">
            <h2 className="text-lg md:text-2xl font-bold uppercase tracking-[0.2em] text-center">
              Top Picks This Season
            </h2>
          </div>
        </div>

        <div className="flex justify-center mb-8 md:mb-16">
          <div className="flex bg-[#D2B48C] rounded-full p-1 shadow-sm">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveTab(category)}
                className={`px-6 py-2 rounded-full text-xs font-semibold tracking-wider transition ${
                  activeTab === category
                    ? "bg-[#FAF6EA] text-black shadow"
                    : "text-black hover:bg-white/30"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* SLIDER */}
        <div className="relative">
          {/* NAV BUTTONS */}
          <button
            onClick={() => swiperRef.current?.slidePrev()}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white w-10 h-10 rounded-full shadow items-center justify-center -ml-2 hidden md:flex"
          >
            <FaChevronLeft />
          </button>

          <button
            onClick={() => swiperRef.current?.slideNext()}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white w-10 h-10 rounded-full shadow items-center justify-center -mr-2 hidden md:flex"
          >
            <FaChevronRight />
          </button>

          <Swiper
            modules={[Navigation, Autoplay]}
            spaceBetween={24}
            slidesPerView={1}
            loop
            autoplay={{ delay: 2500 }}
            breakpoints={{
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            onSwiper={(swiper) => (swiperRef.current = swiper)}
          >
            {filteredProducts.map((product) => (
              <SwiperSlide key={product.id} className="py-10 px-4">
                {/* CARD */}
                <div className="bg-white rounded-2xl shadow-lg p-4 md:p-10 relative h-[240px] md:h-[260px]">
                  {/* FLOATING IMAGE */}
                  <div className="absolute -top-10 left-4 md:left-6 w-24 h-24 md:w-28 md:h-28 bg-white rounded-xl shadow overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* CONTENT */}
                  <div className="pl-28 md:pl-32 flex flex-col h-full justify-between">
                    <span className="bg-pink-500 text-white text-xs px-3 py-1 rounded-full w-fit">
                      {product.badge}
                    </span>

                    <h3 className="font-bold text-lg line-clamp-2">
                      {product.title}
                    </h3>

                    {/* RATING */}
                    <div className="flex items-center gap-2">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <FaStar key={i} size={14} />
                        ))}
                      </div>
                      <span className="text-sm text-gray-500">
                        ({product.reviews})
                      </span>
                    </div>

                    {/* PRICE */}
                    <div className="flex items-center gap-3">
                      <span className="line-through text-gray-400">
                        ₹{product.originalPrice}
                      </span>
                      <span className="text-2xl font-bold">
                        ₹{product.price}
                      </span>
                    </div>

                    {/* BUTTON */}
                    <button className="bg-green-600 hover:bg-green-700 text-white py-2 rounded-full font-semibold">
                      ADD TO CART
                    </button>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default TopPicks;
