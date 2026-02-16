import React, { useEffect, useState, useRef } from "react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";

// Swiper styles
import "swiper/css";
import "swiper/css/navigation";

const Reviews = () => {
  const isLocal =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1";
  const API_BASE_URL = "https://lebrostonebackend.lifeinfotechinstitute.com";

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/reviews/all`);
        const data = await res.json();

        // Only active reviews
        const activeReviews = data.filter((r) => r.status === true);
        setReviews(activeReviews);
      } catch (err) {
        console.error("Review fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "";
    if (imagePath.startsWith("http")) return imagePath;
    return `${API_BASE_URL}${imagePath}`;
  };

  const swiperRef = useRef(null);

  if (loading)
    return (
      <div className="py-20 text-center font-semibold text-[#A88B56] animate-pulse">
        Loading Reviews...
      </div>
    );

  if (!reviews.length) return null;

  return (
    <div className="py-10 md:py-16 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-center mb-10">
          <div className="text-black py-3 px-12 md:px-24">
            <h2 className="text-lg md:text-2xl font-bold uppercase tracking-[0.2em] text-center">
              Customer Reviews
            </h2>
          </div>
        </div>

        <div className="relative max-w-2xl mx-auto group">
          <Swiper
            modules={[Autoplay, Navigation]}
            spaceBetween={30}
            slidesPerView={1}
            loop={true}
            autoplay={{
              delay: 1000,
              disableOnInteraction: false,
            }}
            onSwiper={(swiper) => (swiperRef.current = swiper)}
            className="pb-10"
          >
            {reviews.map((review) => (
              <SwiperSlide key={review._id}>
                <div className="bg-white rounded-2xl md:rounded-3xl shadow-sm border border-gray-50 p-6 md:p-10 flex flex-col items-center text-center">
                  {/* Customer Image */}
                  <div className="w-16 h-16 md:w-20 md:h-20 mb-6 rounded-full overflow-hidden border-2 border-[#FAF6EA] shadow-md">
                    <img
                      src={getImageUrl(review.customerImage)}
                      alt={review.customerName}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Rating */}
                  <div className="flex justify-center gap-1 mb-4">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        fill="#fbbf24"
                        className="text-yellow-400"
                      />
                    ))}
                  </div>

                  {/* Comment */}
                  <p className="text-base md:text-lg text-gray-700 italic leading-relaxed mb-6 font-medium">
                    "{review.comment}"
                  </p>

                  {/* Name */}
                  <h3 className="text-sm md:text-base font-bold text-black uppercase tracking-widest">
                    {review.customerName}
                  </h3>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom Nav Buttons */}
          <button
            onClick={() => swiperRef.current?.slidePrev()}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 z-20 w-10 h-10 rounded-full bg-white shadow-lg items-center justify-center text-gray-400 hover:text-black transition-all hidden md:flex"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => swiperRef.current?.slideNext()}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 z-20 w-10 h-10 rounded-full bg-white shadow-lg items-center justify-center text-gray-400 hover:text-black transition-all hidden md:flex"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Reviews;
