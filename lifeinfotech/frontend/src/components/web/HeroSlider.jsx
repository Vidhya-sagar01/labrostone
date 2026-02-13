import React, { useEffect, useState } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { ChevronLeft, ChevronRight} from "lucide-react";
import { FaShippingFast } from "react-icons/fa";
import { IoBagCheckOutline } from "react-icons/io5";
import { FaUserDoctor } from "react-icons/fa6";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const HeroSlider = () => {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);

   const items = [
        { icon: <FaShippingFast />, title: "Free Shipping" },
        { icon: <IoBagCheckOutline />, title: "Secure Checkout" },
        { icon: <FaUserDoctor />, title: "Free Doctor Consultation" },
    ];

  const API_BASE = "https://lebrostonebackend.lifeinfotechinstitute.com";

  useEffect(() => {
    const fetchSliders = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/admin/sliders`);

        if (res.data.success && Array.isArray(res.data.sliders)) {
          // only active sliders
          const activeSliders = res.data.sliders.filter(
            (s) => s.status === true
          );
          setSlides(activeSliders);
        }
      } catch (err) {
        console.error("Slider error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSliders();
  }, []);

  if (loading)
    return (
      <div className="h-[350px] md:h-[500px] flex items-center justify-center bg-gray-100 font-bold">
        Loading Banners...
      </div>
    );

  if (slides.length === 0) return null;

  return (
    <div className="w-full">

      {/* ================= SLIDER ================= */}
      <Swiper
        modules={[Autoplay, Navigation, Pagination]}
        autoplay={{
          delay: 1000,
          disableOnInteraction: false,
        }}
        loop={true}
        navigation={{
          nextEl: ".custom-next",
          prevEl: ".custom-prev",
        }}
        pagination={{ clickable: true }}
        className="w-full h-[350px] md:h-[500px]"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide._id}>
            <img
              src={slide.image}
              alt={slide.title || "Banner"}
              className="w-full h-full object-cover"
            />
          </SwiperSlide>
        ))}

        {/* Custom Navigation Buttons */}
        <div className="custom-prev absolute left-4 top-1/2 -translate-y-1/2 z-20 cursor-pointer bg-white/30 backdrop-blur p-3 rounded-full">
          <ChevronLeft />
        </div>

        <div className="custom-next absolute right-4 top-1/2 -translate-y-1/2 z-20 cursor-pointer bg-white/30 backdrop-blur p-3 rounded-full">
          <ChevronRight />
        </div>
      </Swiper>

      {/* ================= TRUST BAR ================= */}
     <div className='bg-[#F8F5F0] px-2 w-full py-3 md:py-0 md:h-16 flex items-center'>
            <div className='container mx-auto flex flex-row md:text-sm text-xs justify-center items-center gap-6 px-4'>
                {items.map((item, idx) => (
                    <div key={idx} className='flex items-center gap-4 text-black group'>
                        <span className='text-3xl md:text-2xl transition-transform duration-300 group-hover:scale-110'>
                            {item.icon}
                        </span>
                        <p className='text-xs md:text-xs font-thin uppercase tracking-wider'>
                            {item.title}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    </div>
  );
};

export default HeroSlider;
